import { memo } from 'react'

const Sentence = memo(function Sentence({
  text,
  highlightWord,
  isActive,
  style,
}) {
  if (!isActive) return <p style={style}>{text}</p>

  const wordStyle = { transition: 'background-color 0s' }
  const activeStyle = {
    ...wordStyle,
    backgroundColor: '#004a77',
    color: 'white',
    borderRadius: '4px',}

  const words = text.split(/\s+/)
  return (
    <p style={style}>
      {words.map((w, i) => (
        <span key={i} style={i === highlightWord ? activeStyle : wordStyle}>
          {w + ' '}
        </span>
      ))}
    </p>
  )
})

export default Sentence
