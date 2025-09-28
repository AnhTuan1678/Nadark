import { useState, useEffect } from 'react'
import styles from './LoginPopup.module.css'
import { useAuth } from '../context/AuthContext'
import {
  login as loginNormal,
  register as registerNormal,
} from '../services/api'

const LoginPopup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login') // 👈 tab mặc định
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const { login } = useAuth()

  useEffect(() => {
    if (isOpen) {
      setUsernameOrEmail('')
      setPassword('')
      setEmail('')
    }
  }, [isOpen])

  if (!isOpen) return null

  // Gửi login
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const data = await loginNormal(usernameOrEmail, password)
      console.log(data)

      if (!data.error) {
        login(
          { id: data.id, username: data.username, email: data.email },
          data.token,
        )
        onClose()
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
      alert('Đăng nhập thất bại')
    }
  }

  // Gửi register
  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const data = await registerNormal(usernameOrEmail, email, password)

      if (!data.error) {
        alert('Đăng ký thành công, bạn có thể đăng nhập')
        setActiveTab('login') // chuyển về login
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
      alert('Đăng ký thất bại')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Tabs */}
        <div className={styles.tabHeader}>
          <button
            className={`${styles.tab} ${
              activeTab === 'login' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('login')}>
            Đăng nhập
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === 'register' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('register')}>
            Đăng ký
          </button>
        </div>

        {/* Nội dung */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type='text'
              placeholder='Username hoặc Email'
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
            <input
              type='password'
              placeholder='Mật khẩu'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit'>Đăng nhập</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            <input
              type='text'
              placeholder='Username'
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              placeholder='Mật khẩu'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit'>Đăng ký</button>
          </form>
        )}

        {/* Nút đóng */}
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
    </div>
  )
}

export default LoginPopup
