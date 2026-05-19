import './Header.module.css'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import style from './Header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import ProfileMenu from './ProfileMenu'
import SearchBar from './SearchBar'
import NavBar from './NavBar'
import ThemeToggle from './ThemeToggle'
import NotificationBell from './NotificationBell'
import logo from '../../assets/image/logo.png'

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [show, setShow] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [animation, setAnimation] = useState('')
  const [height, setHeight] = useState(0)

  const fixedRef = useRef(null)

  useEffect(() => {
    if (fixedRef.current) {
      setHeight(fixedRef.current.offsetHeight)
    }
  }, [])

  // scroll xuống → ẩn header
  // scroll lên → hiện header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY

      if (delta > 0 && currentScrollY > 50) {
        if (show) setAnimation('animate__slideOutUp')
        setShow(false)
      } else if (delta < -10 || currentScrollY === 0) {
        if (!show) setAnimation('animate__slideInDown')
        setShow(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, show])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <div
        className={`${style.header} position-fixed top-0 start-0 end-0 animate__animated ${animation}`}
        ref={fixedRef}>
        {isMobile ? (
          <MobileHeader />
        ) : (
          <div
            className={`d-flex align-items-center container py-0 px-2 h-100`}>
            {/* Logo */}
            <Logo />
            <div className='flex-grow-1'></div>
            <SearchBar className='flex-grow-1' />
            <ThemeToggle className='me-2' />
            <NotificationBell className='me-2' />
            <ProfileMenu />
          </div>
        )}
      </div>
      <div style={{ height: height }}></div>
      <NavBar />
    </>
  )
}

const MobileHeader = () => {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className='d-flex h-100'>
      <div className='d-flex w-100 flex-column p-0 ms-2 me-2 justify-content-center'>
        {/* Logo + Profile */}
        {!showSearch && (
          <div className='d-flex align-items-center p-0 m-0 animate__animated animate__fadeInDown animate__faster'>
            <Logo />
            <div className='flex-grow-1'></div>
            <ThemeToggle className='me-2' />
            <div className={'position-relative h-75 m-0'}>
              <div
                className='p-0 d-flex justify-content-center align-items-center rounded-circle h-100 me-2'
                onClick={() => setShowSearch((prev) => !prev)}
                style={{
                  backgroundColor: 'var(--background-theme-toggle)',
                  border: '1px solid gray',
                  position: 'relative',
                  aspectRatio: '1/1',
                }}>
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ color: 'var(--color-theme-icon)' }}
                />
              </div>
            </div>
            <NotificationBell className='me-2' />
            <ProfileMenu />
          </div>
        )}

        {/* Search Bar */}
        {showSearch && (
          <div className='d-flex  align-items-center p-0 animate__animated animate__fadeInDown animate__faster'>
            <div
              className='p-0 d-flex justify-content-center align-items-center rounded-circle me-2'
              onClick={() => setShowSearch((prev) => !prev)}
              style={{
                backgroundColor: 'var(--background-theme-toggle)',
                border: '1px solid gray',
                position: 'relative',
                width: 24,
                height: 24,
                // aspectRatio: '1/1',
              }}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ color: 'var(--color-theme-icon)' }}
              />
            </div>
            <SearchBar className='w-100' />
          </div>
        )}
      </div>
    </div>
  )
}

const Logo = () => {
  const navigate = useNavigate()
  return (
    <div
      className='cursor-pointer'
      onClick={() => {
        navigate('/')
      }}>
      <img
        id='logo'
        src={logo}
        alt='Logo'
        style={{ height: '28px', width: 'auto' }}
      />
    </div>
  )
}

export default Header
