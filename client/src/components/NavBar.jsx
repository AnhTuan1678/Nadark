import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import style from './Header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

const NavBar = ({ className = '' }) => {
  const items = ['Hot', 'Theo dõi', 'Lịch sử', 'Thể loại', 'Tìm truyện']
  const routes = ['/', '/hot', '/bookshelf', '/history', '/category', '/search']
  const navigate = useNavigate()
  const location = useLocation()

  const [active, setActive] = useState(null)

  useEffect(() => {
    const currentIndex = routes.indexOf(location.pathname)
    setActive(currentIndex !== -1 ? currentIndex : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div className={`${className} sticky-top ${style['nav-bar']}`}>
      <div className='container'>
        <ul className='d-flex m-0 p-0'>
          <li
            className={`ps-1 fs-md-7 pe-1 rounded-0 btn opacity-hover-50 bg-opacity-50 text-uppercase ${
              active === 0 ? style.active : ''
            }`}
            onClick={() => navigate('/')}>
            <FontAwesomeIcon icon={faHome} />
          </li>

          {items.map((item, index) => (
            <li
              key={index}
              className={`ps-1 pe-1 fs-md-7 rounded-0 btn opacity-hover-50 bg-opacity-50 text-uppercase ${
                active === index + 1 ? style.active : ''
              }`}
              onClick={() => {
                setActive(index + 1)
                navigate(routes[index + 1])
              }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default NavBar
