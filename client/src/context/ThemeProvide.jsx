  import { useState, useEffect } from 'react'
  import { ThemeContext } from './ThemeContext'

  export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'light'
      }
      return 'light'
    })

    // Lưu lại khi thay đổi
    useEffect(() => {
      document.body.setAttribute('data-bs-theme', theme)
      localStorage.setItem('theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    const toggleTheme = () =>
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    )
  }
