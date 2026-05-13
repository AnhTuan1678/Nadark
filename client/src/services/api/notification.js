import { API_URL } from './config'

export const getMyNotifications = async (token) => {
  const res = await fetch(`${API_URL}/api/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Lỗi tải notifications')
  return res.json()
}

export const getUnreadCount = async (token) => {
  const res = await fetch(`${API_URL}/api/notifications/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Lỗi tải unread count')
  return res.json()
}

export const markRead = async (id, token) => {
  const res = await fetch(`${API_URL}/api/notifications/${id}/read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Lỗi đánh dấu notification đã đọc')
  return res.json()
}

export const markAllRead = async (token) => {
  const res = await fetch(`${API_URL}/api/notifications/read-all`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Lỗi đánh dấu tất cả notifications đã đọc')
  return res.json()
}
