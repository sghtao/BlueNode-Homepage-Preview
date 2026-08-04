const rawBase = import.meta.env.BASE_URL || '/'

export const basePath = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

export function withBase(path = '') {
  const relativePath = path.replace(/^\/+/, '')
  return relativePath ? `${basePath}${relativePath}` : basePath
}
