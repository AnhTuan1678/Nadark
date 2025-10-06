import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import style from './NavBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faHome } from '@fortawesome/free-solid-svg-icons'
import genres from '../assets/genres.json'

const NavBar = ({ className = '' }) => {
  const items = ['Hot', 'Theo dõi', 'Lịch sử', 'Thể loại', 'Tìm truyện']
  const routes = [
    '/',
    '/hot',
    '/bookshelf',
    '/recently',
    '/category',
    '/search',
  ]
  const navigate = useNavigate()
  const location = useLocation()

  const [active, setActive] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [showActive, setShowActive] = useState(true)

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
              (active === 0 && hovered === null && showActive) || hovered === 0
                ? style.active
                : ''
            }`}
            onClick={() => navigate('/')}
            onMouseEnter={() => setHovered(0)}
            onMouseLeave={() => setHovered(null)}>
            <FontAwesomeIcon icon={faHome} />
          </li>

          {items.map((item, index) => {
            if (item === 'Thể loại') {
              return (
                <li key={index} className='position-relative'>
                  <GenresDropdown onHover={setShowActive} />
                </li>
              )
            }

            const liIndex = index + 1
            const isActive =
              (active === liIndex && hovered === null) || hovered === liIndex

            return (
              <li
                key={index}
                className={`ps-1 pe-1 fs-md-7 rounded-0 btn btn-slide opacity-hover-50 bg-opacity-50 text-uppercase ${
                  isActive && showActive ? style.active : ''
                }`}
                onClick={() => {
                  setActive(liIndex)
                  navigate(routes[liIndex])
                }}
                onMouseEnter={() => setHovered(liIndex)}
                onMouseLeave={() => setHovered(null)}>
                {item}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

const GenresDropdown = ({ onHover = () => {} }) => {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [activeGenre, setActiveGenre] = useState(null)

  // Chia thành 4 cột, mỗi cột 15 genres
  const columns = [[], [], [], []]
  genres.forEach((genre, index) => {
    const colIndex = Math.floor(index / 15)
    if (colIndex < 4) columns[colIndex].push(genre)
  })

  useEffect(() => {
    if (hovered) onHover(false)
    else onHover(true)
  })

  return (
    <div
      className='position-relative'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setActiveGenre(null)
      }}>
      <span
        className={`btn fs-md-7 rounded-0 text-uppercase ${
          hovered && style.active
        }`}>
        Thể loại
        <FontAwesomeIcon icon={faCaretDown} />
      </span>

      {hovered && (
        <div
          className={`position-absolute bg-white shadow p-2 top-100 left-0 d-flex ${style.dropdown}`}
          style={{ zIndex: 1000 }}>
          {columns.map((col, colIndex) => (
            <ul key={colIndex} className={`p-0 m-0 ${style.column}`}>
              {col.map((genre) => (
                <li
                  key={genre.id}
                  className={`p-1 hover-bg-light cursor-pointer slide-in-hover ${style.genre}`}
                  onClick={() => {
                    navigate(`/search?genre=${genre.id}`)
                    setHovered(false)
                    // set
                  }}
                  onMouseEnter={() => setActiveGenre(genre)}
                  onMouseLeave={() => setActiveGenre(null)}>
                  {genre.name}
                </li>
              ))}
            </ul>
          ))}

          {/* Hiển thị description */}
          {activeGenre && (
            <div
              className={`${style.description} p-2 m-0 bg-light shadow position-absolute top-100 start-0 w-100 border-top`}
              style={{
                zIndex: 1000,
              }}>
              {activeGenre.description}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NavBar
