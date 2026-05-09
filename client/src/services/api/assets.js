import { API_URL } from './config'

export const uploadMedia = async (token, file) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_URL}/api/assets/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  return res.json()
}
