import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTheme } from '../context/ThemeContext'
import styles from './ThemeToggle.module.css'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const [animate, setAnimate] = useState(false)

  const handleClick = () => {
    setAnimate(true)
    toggleTheme()
  }

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 500)
      return () => clearTimeout(timer)
    }
  }, [animate])

  return (
    <button
      className={`${styles.toggleButton} ps-2`}
      onClick={handleClick}>
      <FontAwesomeIcon
        icon={theme === 'dark' ? faMoon : faSun}
        className={`${styles.icon} ${animate ? styles['icon-move'] : ''}`}
      />
    </button>
  )
}

export default ThemeToggle
