import { useState, useCallback, useEffect } from 'react'
import Snackbar from '../components/SnackBar'
import { SnackbarContext } from './SnackbarContext'

export const SnackbarProvider = ({ children }) => {
  const [snackBars, setSnackBars] = useState([])

  // Hiển thị snackbar mới
  const showSnackbar = useCallback(
    ({ message, status = 'success', duration = 3000 }) => {
      const id = Math.random().toString(36).slice(2, 9)

      const timeoutId = setTimeout(() => handleClose(id), duration)

      setSnackBars((prev) => [
        ...prev,
        { id, message, status, duration, timeoutId, progress: 100 },
      ])
    },
    [],
  )

  // Đóng snackbar
  const handleClose = (id) => {
    setSnackBars((prev) => {
      const snack = prev.find((s) => s.id === id)
      if (snack?.timeoutId) clearTimeout(snack.timeoutId)
      return prev.filter((s) => s.id !== id)
    })
  }

  // Cập nhật progress mỗi 50ms
  useEffect(() => {
    const interval = setInterval(() => {
      setSnackBars((prev) =>
        prev.map((s) => ({
          ...s,
          progress: Math.max(s.progress - 100 / (s.duration / 50), 0),
        })),
      )
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <div
        className='position-fixed top-0 start-0 m-3 d-flex flex-column gap-2'
        style={{ zIndex: 9999 }}>
        {snackBars.map((snack) => (
          <Snackbar
            key={snack.id}
            message={snack.message}
            status={snack.status}
            progress={snack.progress}
            onClose={() => handleClose(snack.id)}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  )
}
