import { useTheme } from '../context/ThemeContext'

const Settings = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className={`btn btn-${theme === 'light' ? 'dark' : 'light'}`}
      onClick={toggleTheme}>
      Chuyển sang {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  )
}

export default Settings
