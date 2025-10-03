import { API_URL } from './config'
import { formatterStoryDetail } from '../../utils/formatter'

export const addToBookshelf = async (token, bookId) => {
  const res = await fetch(`${API_URL}/api/account/bookshelf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ book_id: bookId }),
  })
  return res.json()
}

export const getBookshelf = async (token) => {
  const res = await fetch(`${API_URL}/api/bookshelf`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Lấy tủ sách thất bại')

  const data = await res.json()
  return data.map((item) => ({
    ...formatterStoryDetail(item.Book),
    savedAt: item.saved_at,
  }))
}

export const removeFromBookshelf = async (token, bookId) => {
  const res = await fetch(`${API_URL}/api/account/bookshelf/${bookId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
