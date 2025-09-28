const API_URL = import.meta.env.VITE_API_URL
console.log(API_URL)

const login = async (usernameOrEmail, password) => {
  const res = await fetch(`${API_URL}/api/account/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail, password }),
  })
  const data = await res.json()
  return data
}

const register = async (usernameOrEmail, email, password) => {
  const res = await fetch(`${API_URL}/api/account/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: usernameOrEmail, email, password }),
  })
  const data = await res.json()
  return data
}

const getStoryDetails = async (storyId) => {
  const res = await fetch(`${API_URL}/api/book/${storyId}`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()

  return {
    ...data,
    chapterCount: data.chapter_count,
    publishedDate: data.created_at,
    urlAvatar: data.url_avatar,
  }
}

const getChapters = async (storyId) => {
  const res = await fetch(`${API_URL}/api/book/${storyId}/chapters`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()

  const formattedChapters = data.map((ch) => ({
    chapterId: ch.id,
    index: ch.index,
    title: ch.title,
    releaseDate: ch.created_at ? ch.created_at : '2023-01-02',
  }))
  return formattedChapters || {}
}

const getChapterContent = async (index, bookId) => {
  const res = await fetch(`${API_URL}/api/book/${bookId}/chapter/${index}`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()
  return data
}

export {
  API_URL,
  getStoryDetails,
  getChapters,
  getChapterContent,
  login,
  register,
}
