import type { APIRoute } from 'astro'

export const prerender = true

export const GET: APIRoute = () => new Response(
  JSON.stringify({ buildId: process.env.GITHUB_SHA ?? 'local' }),
  {
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json; charset=utf-8',
    },
  },
)
