import { members } from '../data/members'
import {
  getResearchArticlesNewestFirst,
  type ResearchArticle,
} from '../data/research'

const MEDIUM_FEED_URL = 'https://medium.com/feed/bluenode'
const FETCH_TIMEOUT_MS = 8_000

export type FeedArticle = ResearchArticle & {
  authorNames?: string[]
}

const memberLookup = new Map(
  members.flatMap((member) =>
    [member.handle, member.displayName, ...member.aliases].map((name) => [
      name.trim().toLocaleLowerCase('en-US'),
      member.handle,
    ]),
  ),
)

function fallbackArticles(): FeedArticle[] {
  return getResearchArticlesNewestFirst()
}

function unwrapCdata(value: string): string {
  return value.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, '$1').trim()
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&nbsp;', ' ')
}

function textFromElement(block: string, tag: string): string | undefined {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return match ? decodeEntities(unwrapCdata(match[1])) : undefined
}

function textsFromElement(block: string, tag: string): string[] {
  const values: string[] = []
  const pattern = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'gi')
  let match: RegExpExecArray | null
  while ((match = pattern.exec(block))) values.push(decodeEntities(unwrapCdata(match[1])))
  return values
}

function plainText(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()
}

function stableHash(value: string): string {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

function normalizeUrlKey(value: string): string {
  const decoded = decodeURI(value)
  const pathname = new URL(decoded).pathname.toLocaleLowerCase('en-US')
  return pathname.replace(/\/+$/, '') || '/'
}

function parseFeed(xml: string): FeedArticle[] {
  const openItems = xml.match(/<item(?:\s[^>]*)?>/gi)?.length ?? 0
  const itemBlocks = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) ?? []
  if (!openItems || openItems !== itemBlocks.length) throw new Error('Malformed Medium RSS items')

  return itemBlocks.map((item) => {
    const title = textFromElement(item, 'title')
    const externalUrl = textFromElement(item, 'link')
    const published = textFromElement(item, 'pubDate')
    if (!title || !externalUrl || !published) throw new Error('Medium RSS item is missing a required field')

    // Only http(s) links may be baked into the site. A compromised feed could
    // otherwise smuggle a `javascript:` (or other) scheme into a live <a href>.
    let externalParsed: URL
    try {
      externalParsed = new URL(externalUrl)
    } catch {
      throw new Error('Medium RSS item has an unparseable link')
    }
    if (externalParsed.protocol !== 'http:' && externalParsed.protocol !== 'https:') {
      throw new Error('Medium RSS item link uses a disallowed URL scheme')
    }
    // Drop Medium's tracking query (?source=rss----…) from the stored href.
    const cleanUrl = `${externalParsed.origin}${externalParsed.pathname}`

    const timestamp = Date.parse(published)
    if (!Number.isFinite(timestamp)) throw new Error('Medium RSS item has an invalid publication date')

    const creator = textFromElement(item, 'dc:creator')
    const authorNames = creator ? [creator] : []
    const authorHandles = authorNames
      .map((name) => memberLookup.get(name.trim().toLocaleLowerCase('en-US')))
      .filter((handle): handle is string => Boolean(handle))
    const description = textFromElement(item, 'description') ?? textFromElement(item, 'content:encoded') ?? ''
    const mediumId = externalUrl.match(/-([\da-f]{8,})(?:\/?(?:\?.*)?)$/i)?.[1] ?? stableHash(normalizeUrlKey(externalUrl))

    return {
      recordId: `M/${mediumId}`,
      slug: `medium-${mediumId}`,
      title: plainText(title),
      authorHandles,
      authorNames,
      publishedAt: new Date(timestamp).toISOString().slice(0, 10),
      tags: textsFromElement(item, 'category').map(plainText).filter(Boolean),
      snippet: plainText(description).slice(0, 360),
      externalUrl: cleanUrl,
    }
  })
}

function mergeWithFallback(rssArticles: FeedArticle[]): FeedArticle[] {
  const merged = new Map<string, FeedArticle>()
  for (const article of fallbackArticles()) merged.set(normalizeUrlKey(article.externalUrl), article)
  for (const article of rssArticles) {
    const key = normalizeUrlKey(article.externalUrl)
    if (!merged.has(key)) merged.set(key, article)
  }
  return [...merged.values()].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.recordId.localeCompare(b.recordId),
  )
}

async function fetchMediumFeed(): Promise<FeedArticle[]> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const response = await fetch(MEDIUM_FEED_URL, {
      signal: controller.signal,
      headers: { accept: 'application/rss+xml, application/xml;q=0.9' },
    })
    if (!response.ok) throw new Error(`Medium RSS returned HTTP ${response.status}`)
    return mergeWithFallback(parseFeed(await response.text()))
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    console.warn(`[medium] RSS unavailable; using research fallback (${reason})`)
    return fallbackArticles()
  } finally {
    clearTimeout(timeout)
  }
}

let feedPromise: Promise<FeedArticle[]> | undefined

// Roadmap only: authorship may move to a Notion SSOT, then canonical ownership
// can reverse from Medium to this site. Medium remains canonical today.
export function getMediumFeedArticles(): Promise<FeedArticle[]> {
  feedPromise ??= fetchMediumFeed()
  return feedPromise
}
