import { createContext, useContext } from 'react'

// Tạo context
export const ThemeContext = createContext()

// Hook tiện dùng
export const useTheme = () => useContext(ThemeContext)
