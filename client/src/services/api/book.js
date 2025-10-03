import { API_URL } from './config'
import { cacheFetch } from '../cacheFetch'
import { formatterStoryDetail } from '../../utils/formatter'

export const getAllStory = async () => {
  const res = await cacheFetch(`${API_URL}/api/book`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const data = await res.json()
  return data.map((book) => ({
    ...book,
    chapterCount: book.chapter_count,
    publishedDate: book.created_at,
    urlAvatar: book.url_avatar,
  }))
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

export const searchBooks = async (query) => {
  if (!query || query.trim() === '')
    throw new Error('Query không được để trống')

  const res = await fetch(
    `${API_URL}/api/book/search?query=${encodeURIComponent(query)}`,
  )
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

  const data = await res.json()
  return data.map((book) => ({
    ...book,
    chapterCount: book.chapter_count,
    publishedDate: book.created_at,
    urlAvatar: book.url_avatar,
  }))
}