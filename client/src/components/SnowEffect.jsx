import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Snowflake from '../assets/image/Snowflake.png'
import './SnowEffect.css'

const SnowEffect = () => {
  const [snowflakes, setSnowflakes] = useState([])
  const animationRef = useRef()
  const SCREEN_FACTOR = 41472 // Màn hình 1920*1080 ~ 50 bông
  const count = Math.floor(
    (window.innerWidth * window.innerHeight) / SCREEN_FACTOR,
  )

  // Khởi tạo bông tuyết
  useEffect(() => {
    const initialFlakes = Array.from({ length: count }).map(() => ({
      id: Math.random().toString(36).slice(2, 11),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 20 + 5,
      speed: Math.random() * 1.5 + 0.5,
      swing: Math.random() * 50,
      swingSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }))
    setSnowflakes(initialFlakes)
  }, [count])

  // Cập nhật vị trí bông tuyết mỗi frame
  useEffect(() => {
    const update = () => {
      setSnowflakes((prev) =>
        prev.map((f) => {
          let newY = f.y + f.speed
          let newAngle = f.angle + f.swingSpeed
          let newX = f.x + Math.sin(newAngle) * 0.5

          // Khi bông tuyết rơi ra ngoài màn hình → reset từ trên
          if (newY > window.innerHeight) {
            newY = -f.size
            newX = Math.random() * window.innerWidth
          }

          return { ...f, x: newX, y: newY, angle: newAngle }
        }),
      )
      animationRef.current = requestAnimationFrame(update)
    }
    animationRef.current = requestAnimationFrame(update)

    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  return createPortal(
    <div id='snow-container'>
      {snowflakes.map((flake) => (
        <img
          key={flake.id}
          src={Snowflake}
          alt='snowflake'
          className='snowflake'
          style={{
            left: flake.x + 'px',
            top: flake.y + 'px',
            width: flake.size + 'px',
            transform: `rotate(${flake.angle}rad)`,
          }}
        />
      ))}
    </div>,
    document.body,
  )
}

export default SnowEffect
