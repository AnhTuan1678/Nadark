import { API_URL } from './config'
// import { cacheFetch } from '../cacheFetch'
// import { formatterStoryDetail } from '../../utils/formatter'

export const createChapter = async (chapterData, token) => {
  const res = await fetch(`${API_URL}/api/chapter/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(chapterData),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
  }

  const data = await res.json()
  return data
}

export const getChapter = async (chapterId) => {
  const res = await fetch(`${API_URL}/api/chapter/${chapterId}`)

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
  }

  const data = await res.json()
  return data
}

export const updateChapter = async (chapterId, updateData, token) => {
  const res = await fetch(`${API_URL}/api/chapter/${chapterId}`, {
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
  return data
}

export const deleteChapter = async (chapterId, token) => {
  const res = await fetch(`${API_URL}/api/chapter/${chapterId}`, {
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
  return data
}

export const deleteManyChapters = async ( chapterIds, token) => {
  const res = await fetch(`${API_URL}/api/chapter/bulk/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chapterIds }),
  })

  if (!res.ok) {
    const errorData = await res.json()

    throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
  }

  const data = await res.json()

  return data
}
