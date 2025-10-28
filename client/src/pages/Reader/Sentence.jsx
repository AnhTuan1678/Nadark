import { forwardRef, memo } from 'react'

const Sentence = memo(
  forwardRef(function Sentence({ text, highlightWord, isActive, style }, ref) {
    if (!isActive)
      return (
        <p ref={ref} style={style}>
          {text}
        </p>
      )

    const wordStyle = { transition: 'background-color 0s' }
    const activeStyle = {
      ...wordStyle,
      backgroundColor: '#004a77',
      color: 'white',
      borderRadius: '4px',
    }

    const words = text.split(/\s+/)
    return (
      <p ref={ref} style={{...style, boxShadow: '0 0 0 1px var(--secondary--color)'}}>
        {words.map((w, i) => (
          <span key={i} style={i === highlightWord ? activeStyle : wordStyle}>
            {w + ' '}
          </span>
        ))}
      </p>
    )
  }),
)

export default Sentence
