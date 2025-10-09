import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../context/ThemeContext'
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
    <div className='form-check form-switch h-75 m-0'>
      <input
        className='form-check-input d-none'
        type='checkbox'
        id='themeSwitch'
        checked={theme === 'dark'}
        onChange={handleClick}
      />
      <label
        className='form-check-label d-flex align-items-center h-100'
        htmlFor='themeSwitch'>
        <div
          className='position-relative d-flex align-items-center h-100'
          style={{
            aspectRatio: '2/ 1',
            borderRadius: '9999px',
            backgroundColor: 'var(--background-theme-icon)',
            transition: 'background-color 0.5s',
          }}>
          <div
            className={`position-absolute start-0 rounded-circle h-100`}
            style={{
              aspectRatio: '1 / 1',
              backgroundColor: 'var(--background-theme-toggle)',
              border: '1px solid gray',
              transform:
                theme === 'dark' ? 'translateX(100%)' : 'translateX(0%)',
              transition: 'transform 0.3s',
            }}>
            <FontAwesomeIcon
              className=''
              icon={theme === 'dark' ? faMoon : faSun}
              style={{
                color: 'var(--color-theme-icon)',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        </div>
      </label>
    </div>
  )
}

export default ThemeToggle
