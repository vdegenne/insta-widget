export function cwd () {
  const url = new URL(import.meta.url)
  return `${url.origin}${url.pathname.split('/').slice(0, -1).join('/')}`
}
