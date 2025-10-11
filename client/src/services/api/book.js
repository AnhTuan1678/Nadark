import { API_URL } from './config'
import { cacheFetch } from '../cacheFetch'
import { formatterStoryDetail } from '../../utils/formatter'

export const getAllStory = async ({ limit = 30, offset = 0 }) => {
  const res = await cacheFetch(
    `${API_URL}/api/book?limit=${limit}&offset=${offset}`,
  )

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

  const data = await res.json()

  const list = Array.isArray(data.data) ? data.data : data
  return {
    total: data.total || list.length || 0,
    data: list.map((book) => formatterStoryDetail(book)),
  }
}

export const getNewlyUpdatedBooks = async (limit = 20, offset = 0) => {
  const res = await cacheFetch(
    `${API_URL}/api/book/newly-updated?limit=${limit}&offset=${offset}`,
  )

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

  const data = await res.json()
  return {
    total: data.total || 0,
    data: (data.data || []).map((book) => formatterStoryDetail(book)),
  }
}

export const getNewlyCreatedBooks = async (limit = 20, offset = 0) => {
  const res = await cacheFetch(
    `${API_URL}/api/book/newly-created?limit=${limit}&offset=${offset}`,
  )

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

  const data = await res.json()
  return {
    total: data.total || 0,
    data: (data.data || []).map((book) => formatterStoryDetail(book)),
  }
}

export const getMostFollowedBooks = async (limit = 20, offset = 0) => {
  const res = await cacheFetch(
    `${API_URL}/api/book/most-followed?limit=${limit}&offset=${offset}`,
  )

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

  const data = await res.json()
  return {
    total: data.total || 0,
    data: (data.data || []).map((book) => formatterStoryDetail(book)),
  }
}

export const getStoryDetails = async (storyId) => {
  const res = await cacheFetch(`${API_URL}/api/book/${storyId}`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()
  return formatterStoryDetail(data)
}

export const getChapters = async (storyId) => {
  const res = await cacheFetch(`${API_URL}/api/book/${storyId}/chapters`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()
  return data.map((ch) => ({
    chapterId: ch.id,
    index: ch.index,
    title: ch.title,
    releaseDate: ch.created_at,
  }))
}

export const getChapterContent = async (index, bookId) => {
  const res = await cacheFetch(`${API_URL}/api/book/${bookId}/chapter/${index}`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return res.json()
}

export const searchBooks = async ({
  query,
  genres = [],
  minChapter = 0,
  maxChapter = 1e6,
  limit = 8,
}) => {
  const params = new URLSearchParams()
  params.append('query', query)
  if (genres.length > 0) params.append('genres', genres.join(','))
  if (minChapter > 0) params.append('minChapter', minChapter)
  if (maxChapter && maxChapter < 1e6) params.append('maxChapter', maxChapter)
  if (limit) params.append('limit', limit)

  const res = await cacheFetch(
    `${API_URL}/api/book/search?${params.toString()}`,
  )
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

  const data = await res.json()
  return data.map((book) => formatterStoryDetail(book))
}

export const getTopStoriesStats = async (limit = 10) => {
  const res = await cacheFetch(`${API_URL}/api/book/top/stats?limit=${limit}`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

  const data = await res.json()

  // Đảm bảo dữ liệu hợp lệ và format từng phần
  const formatList = (list = []) =>
    list.map((book) => formatterStoryDetail(book))

  return {
    today: formatList(data.today),
    week: formatList(data.week),
    month: formatList(data.month),
  }
}

export const createBook = async (bookData, token) => {
  const res = await fetch(`${API_URL}/api/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
  }

  const data = await res.json()
  return formatterStoryDetail(data)
}

export const updateBook = async (bookId, updateData, token) => {
  const res = await fetch(`${API_URL}/api/book/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
  }

  const data = await res.json()
  return formatterStoryDetail(data)
}

export const deleteBook = async (bookId, token) => {
  const res = await fetch(`${API_URL}/api/book/${bookId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
  }

  const data = await res.json()
  return data // { message: 'Xóa sách thành công' }
}
