import { useState, useRef, useEffect } from 'react'
import ReaderControls from './ReaderControls'
import style from './styles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeadphones } from '@fortawesome/free-solid-svg-icons'

function FloatingButton({ readingProps }) {
  const [showControls, setShowControls] = useState(false)
  const [posY, setPosY] = useState(100)
  const dragging = useRef(false)
  const offsetY = useRef(0)
  const buttonRef = useRef(null)
  const controlsRef = useRef(null)

  // Mouse
  const handleMouseDown = (e) => {
    dragging.current = true
    offsetY.current = e.clientY - posY
    e.preventDefault()
  }
  const handleMouseMove = (e) => {
    if (dragging.current) setPosY(e.clientY - offsetY.current)
  }
  const handleMouseUp = () => { dragging.current = false }

  // Touch
  const handleTouchStart = (e) => {
    dragging.current = true
    offsetY.current = e.touches[0].clientY - posY
  }
  const handleTouchMove = (e) => {
    if (dragging.current) setPosY(e.touches[0].clientY - offsetY.current)
  }
  const handleTouchEnd = () => { dragging.current = false }

  // Gắn sự kiện kéo
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  // Click ngoài để đóng
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        controlsRef.current &&
        !controlsRef.current.contains(e.target)
      ) {
        setShowControls(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  return (
    <>
      <div
        ref={buttonRef}
        className={style.floatingButton}
        style={{ left: 0, top: posY }}
        onClick={() => setShowControls((prev) => !prev)}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <FontAwesomeIcon icon={faHeadphones} />
      </div>

      {showControls && (
        <div
          ref={controlsRef}
          className={style.controlsWrapper}
          style={{ left: 50, top: posY }}
        >
          <ReaderControls {...readingProps} />
        </div>
      )}
    </>
  )
}

export default FloatingButton
