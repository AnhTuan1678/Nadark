import { useTheme } from '../context/ThemeContext'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSnowEffect } from '../redux/settingSlice'
import styles from './Settings.module.css'

const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const snowEffect = useSelector((state) => state.setting.snowEffect)
  const dispatch = useDispatch()
  // const [snowEffect, setSnowEffect] = useState(false)

  return (
    <div className='p-4'>
      <div
        className={`${styles.container} ${
          theme === 'dark' ? styles.dark : styles.light
        } w-100`}>
        <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Cài đặt</h3>

        {/* Toggle Theme */}
        <div className={styles.option}>
          <span>Chế độ Dark/Light</span>
          <label className={styles.switch}>
            <input
              type='checkbox'
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        {/* Bật bông tuyết */}
        <div className={styles.option}>
          <span>Bật hiệu ứng bông tuyết</span>
          <label className={styles.switch}>
            <input
              type='checkbox'
              checked={snowEffect}
              onChange={() => dispatch(toggleSnowEffect())}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default Settings
