import { db } from './cacheDB'

export const cacheFetch = async (
  url,
  options = {},
  { ttl = 5 * 60 * 1000, noCache = false } = {},
) => {
  const key = JSON.stringify({ url, options })
  const now = Date.now()

  if (!noCache) {
    const cached = await db.cache.get(key)
    if (cached && now < cached.expiry) {
      return new Response(JSON.stringify(cached.data))
    } else if (cached) {
      await db.cache.delete(key)
    }
  }

  const res = await fetch(url, options)

  if (!noCache && res.ok) {
    const clone = res.clone()
    try {
      const data = await clone.json()
      await db.cache.put({
        key,
        data,
        expiry: now + ttl,
      })
    } catch (err) {
      console.warn('Không thể parse JSON để cache:', err)
    }
  }

  return res
}

export const clearCache = async () => {
  await db.cache.clear()
}
