import { formatterStoryDetail } from '../../utils/formatter'
import { API_URL } from './config'

export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}/api/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export const getUserById = async (userId) => {
  const res = await fetch(`${API_URL}/api/user/${userId}`)
  return res.json()
}

export const updateProfile = async (token, formData) => {
  const res = await fetch(`${API_URL}/api/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  if (!res.ok) {
    throw new Error('Upload avatar thất bại')
  }
  return res.json()
}

export const updateAvatar = async (token, formData) => {
  const res = await fetch(`${API_URL}/api/user/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return res.json()
}

export const updateSettings = async (token, settings) => {
  const res = await fetch(`${API_URL}/api/user/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ settings }),
  })
  return res.json()
}

export const getMyBooks = async (token, limit = 24, offset = 0) => {
  const url = `${API_URL}/api/book/my-books?limit=${limit}&offset=${offset}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
  }

  const data = await res.json()
  const formattedBooks = (data.data || []).map((book) =>
    formatterStoryDetail(book),
  )

  return {
    total: data.total || 0,
    data: formattedBooks,
  }
}

export const getUserBooks = async (userId, limit = 24, offset = 0) => {
  if (!userId) throw new Error('USER_ID_REQUIRED')

  const url = `${API_URL}/api/book/user/${userId}?limit=${limit}&offset=${offset}`
  const res = await fetch(url)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
  }

  const data = await res.json()
  const formattedBooks = (data.data || []).map((book) =>
    formatterStoryDetail(book),
  )

  return {
    total: data.total || 0,
    data: formattedBooks,
  }
}
