import './Header.module.css'
import { useEffect, useState } from 'react'
import ProfileMenu from './ProfileMenu'
import SearchBar from './SearchBar'
import AnandaFont from '../assets/Ananda.ttf'
import style from './Header.module.css'

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const handleSearch = (query) => {
    console.log('Tìm:', query)
  }
  return (
    <div className={`${style.header} `}>
      {isMobile ? (
        <div className={`d-flex flex-column align-items-center container p-2 `}>
          <div className={`d-flex align-items-center container p-2 `}>
            <h1
              className={`logo ${style.logo} fs-1 me-4 text-white animate__animated animate__fadeInLeft flex-grow-1`}
              style={{ fontFamily: 'Ananda' }}>
              Nadark
            </h1>

            <ProfileMenu className='flex-grow-1' />
          </div>
          <SearchBar
            className='flex-grow-1'
            onSearch={(q) => handleSearch(q)}
          />
        </div>
      ) : (
        <div className={`d-flex align-items-center container p-2 `}>
          <h1
            className={`logo ${style.logo} fs-1 me-4 text-white animate__animated animate__fadeInLeft flex-grow-1`}
            style={{ fontFamily: 'Ananda' }}>
            Nadark
          </h1>

          <SearchBar
            className='flex-grow-1'
            onSearch={(q) => handleSearch(q)}
          />
          <ProfileMenu className='flex-grow-1' />
        </div>
      )}
    </div>
  )
}

export default Header
