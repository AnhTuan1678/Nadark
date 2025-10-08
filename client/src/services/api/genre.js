import { API_URL } from './config'

export const getAll = async () => {
  try {
    const response = await fetch(`${API_URL}/api/genre`)
    if (!response.ok) throw new Error('Lỗi khi gọi API')

    const genres = await response.json()
    console.log('Danh sách thể loại:', genres)
    return genres
  } catch (error) {
    console.error('Lỗi:', error)
    return []
  }
}
