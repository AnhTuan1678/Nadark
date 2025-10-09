import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { createPortal } from 'react-dom'
import Snowflake from '../assets/image/Snowflake.png'
import './SnowEffect.css'

const SnowEffect = () => {
  const snowEffectEnabled = useSelector((state) => state.setting.snowEffect)
  const snowSettings = useSelector((state) => state.setting.snowSettings)

  const [snowflakes, setSnowflakes] = useState([])
  const animationRef = useRef()

  const count = Math.floor(
    (window.innerWidth * window.innerHeight) / snowSettings.countFactor,
  )

  useEffect(() => {
    if (!snowEffectEnabled) return

    const initialFlakes = Array.from({ length: count }).map(() => ({
      id: Math.random().toString(36).slice(2, 11),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size:
        Math.random() * (snowSettings.maxSize - snowSettings.minSize) +
        snowSettings.minSize,
      speed:
        Math.random() * (snowSettings.maxSpeed - snowSettings.minSpeed) +
        snowSettings.minSpeed,
      swing: Math.random() * snowSettings.swingAmplitude,
      swingSpeed:
        Math.random() *
          (snowSettings.swingSpeedMax - snowSettings.swingSpeedMin) +
        snowSettings.swingSpeedMin,
      angle: Math.random() * Math.PI * 2,
    }))
    setSnowflakes(initialFlakes)
  }, [count, snowEffectEnabled, snowSettings])

  useEffect(() => {
    if (!snowEffectEnabled) return

    const update = () => {
      setSnowflakes((prev) =>
        prev.map((f) => {
          let newY = f.y + f.speed
          let newAngle = f.angle + f.swingSpeed
          let newX = f.x + Math.sin(newAngle) * 0.5
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
  }, [snowEffectEnabled])

  if (!snowEffectEnabled) return null

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
