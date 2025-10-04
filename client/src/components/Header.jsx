import './Header.module.css'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ProfileMenu from './ProfileMenu'
import SearchBar from './SearchBar'
import style from './Header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRotateBack,
  faArrowsRotate,
  faBars,
  faExchangeAlt,
  faHome,
} from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [show, setShow] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [animation, setAnimation] = useState('')

  const navigate = useNavigate()

  const fixedRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (fixedRef.current) {
      setHeight(fixedRef.current.offsetHeight) // Hoặc .getBoundingClientRect().height
    }
  }, [])

  // scroll xuống → ẩn header
  // scroll lên → hiện header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        if (show) setAnimation('animate__slideOutUp')
        setShow(false)
      } else {
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
        className={`${style.header} animate__animated ${animation}`}
        ref={fixedRef}>
        {isMobile ? (
          <MobileHeader />
        ) : (
          <div className={`d-flex align-items-center container p-1`}>
            <div className='flex-grow-1 d-flex'>
              <h1
                className={`pt-1 logo fs-4 animate__animated animate__fadeInLeft  cursor-pointer d-inline-block p-0 m-0 ${style.logo}`}
                onClick={() => navigate(`/`)}
                style={{ fontFamily: 'Ananda' }}>
                {/* Nadark */}
                {import.meta.env.VITE_APP_NAME}
              </h1>
            </div>
            <SearchBar />
            <ProfileMenu className='ps-2' />
          </div>
        )}
      </div>
      <div style={{ height: height }}></div>
      <NavBar />
    </>
    // <MobileHeader />
  )
}

const MobileHeader = () => {
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className='d-flex'>
      {/* Nút toggle */}
      <button
        className='btn ps-1 btn-primary m-0 p-0 bg-transparent'
        onClick={() => setShowSearch((prev) => !prev)}
        style={{ zIndex: 9999, height: '46px' }}>
        <FontAwesomeIcon icon={faArrowsRotate} />
      </button>
      <div className='d-flex w-100 flex-column p-1'>
        {/* Logo + Profile */}
        {!showSearch && (
          <div className='d-flex align-items-center p-1 m-0 animate__animated animate__fadeInDown animate__faster'>
            <h1
              className={`logo fs-4 m-0 ${style.logo} cursor-pointer`}
              style={{ fontFamily: 'Ananda' }}
              onClick={() => navigate('/')}>
              {import.meta.env.VITE_APP_NAME}
            </h1>
            <ProfileMenu className='flex-grow-1' />
          </div>
        )}

        {/* Search Bar */}
        {showSearch && (
          <div className='d-flex p-1 animate__animated animate__fadeInDown animate__faster'>
            <SearchBar className='w-100' />
          </div>
        )}
      </div>
    </div>
  )
}

const NavBar = ({ className }) => {
  const items = ['Hot', 'Theo dõi', 'Lịch sử', 'Thể loại', 'Tìm truyện']
  const navigate = useNavigate()
  const location = useLocation()

  const [active, setActive] = useState(null)

  useEffect(() => {
    // Tùy vào pathname để set active
    switch (location.pathname) {
      case '/':
        setActive(0)
        break
      case '/hot':
        setActive(1)
        break
      case '/follow':
        setActive(2)
        break
      case '/history':
        setActive(3)
        break
      case '/category':
        setActive(4)
        break
      default:
        setActive(null)
    }
  }, [location.pathname])

  return (
    <div className={`${className} sticky-top ${style['nav-bar']}`}>
      <div className='container'>
        <ul className='d-flex m-0 p-0'>
          <li
            className={`ps-1 fs-md-7 pe-1 rounded-0 btn opacity-hover-50 bg-opacity-50 text-uppercase  ${
              active === 0 ? style.active : ''
            }`}
            onClick={() => navigate('/')}>
            <FontAwesomeIcon icon={faHome} />
          </li>
          {items.map((item, index) => (
            <li
              key={index}
              className={`ps-1 pe-1 fs-md-7 rounded-0 btn opacity-hover-50 bg-opacity-50 text-uppercase  ${
                active === index + 1 ? style.active : ''
              }`}
              onClick={() => {
                setActive(index + 1)
                // navigate tùy item
                switch (index) {
                  case 0:
                    navigate('/hot')
                    break
                  case 1:
                    navigate('/follow')
                    break
                  case 2:
                    navigate('/history')
                    break
                  case 3:
                    navigate('/category')
                    break
                  case 4:
                    navigate('/search')
                    break
                }
              }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Header
