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

const getProfile = async (token) => {
  try {
    const res = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // gửi token JWT
      },
    })

    const data = await res.json()
    return data
  } catch (err) {
    console.error('Lỗi khi gọi getProfile:', err)
    return { error: 'Không thể kết nối server' }
  }
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

const getAllStory = async () => {
  const res = await fetch(`${API_URL}/api/book`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()

  // Map lại từng book để đồng nhất field
  return data.map((book) => ({
    ...book,
    chapterCount: book.chapter_count,
    publishedDate: book.created_at,
    urlAvatar: book.url_avatar,
  }))
}

const searchBooks = async (query) => {
  if (!query || query.trim() === '') {
    throw new Error('Query không được để trống')
  }

  const res = await fetch(
    `${API_URL}/api/book/search?query=${encodeURIComponent(query)}`,
  )
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()

  // Map lại từng book để đồng nhất field với client
  return data.map((book) => ({
    ...book,
    chapterCount: book.chapter_count,
    publishedDate: book.created_at,
    urlAvatar: book.url_avatar,
  }))
}

export {
  API_URL,
  getStoryDetails,
  getAllStory,
  getChapters,
  getChapterContent,
  login,
  register,
  getProfile,
  searchBooks,
}
