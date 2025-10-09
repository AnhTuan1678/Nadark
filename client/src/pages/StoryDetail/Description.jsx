import { useEffect, useRef, useState } from "react"

const Description = ({ description }) => {
  const [showAll, setShowAll] = useState(false)
  const [needsClamp, setNeedsClamp] = useState(false)

  const textRef = useRef(null)

  const maxLines = 6

  useEffect(() => {
    const el = textRef.current
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
      const lines = el.scrollHeight / lineHeight
      if (lines > maxLines) {
        setNeedsClamp(true)
      } else {
        setNeedsClamp(false)
      }
    }
  }, [description])

  const toggleShow = () => {
    if (showAll) {
      const rect = textRef.current.getBoundingClientRect()
      const offset = window.scrollY + rect.top

      setShowAll(false)

      // cuộn về vị trí cũ sau khi thu gọn
      setTimeout(() => {
        window.scrollTo({ top: offset, behavior: 'auto' })
      }, 50) // delay nhỏ để DOM reflow
    } else {
      setShowAll(true)
    }
  }

  return (
    <>
      <div className='position-relative border-top border-3 pt-3 border-secondary'>
        <p
          ref={textRef}
          className='fw-lighter fst-italic mb-1'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: !showAll && needsClamp ? maxLines : 'unset',
            WebkitBoxOrient: 'vertical',
            overflow: !showAll && needsClamp ? 'hidden' : 'visible',
          }}>
          {description}
        </p>

        {!showAll && needsClamp && (
          <div
            className='12345'
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4rem',
              background:
                'linear-gradient(180deg, rgba(var(--color-container-background-rgb), 0) 10%, rgba(var(--color-container-background-rgb), 0.75) 75%, rgba(var(--color-container-background-rgb), 1) 100%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      {needsClamp && (
        <div className='btn opacity-hover-50 mt-1' onClick={toggleShow}>
          {showAll ? 'Thu gọn' : 'Xem thêm'}
        </div>
      )}
    </>
  )
}

export default Description
