import { useRef, useEffect } from 'react'
import { useReaderTTS } from '../../hooks/useReaderTTS'
import Loading from '../../components/Loading'
import Sentence from './Sentence'
import FloatingButton from './FloatingButton'

function ReaderContent({ content, setting }) {
  const {
    lines,
    reading,
    currentLine,
    currentWord,
    voices,
    start,
    stop,
    prevLine,
    nextLine,
  } = useReaderTTS(content)

  const lineRefs = useRef([])

  useEffect(() => {
    lineRefs.current = lines.map((_, i) => lineRefs.current[i] || null)
  }, [lines])

  // Cuộn đến dòng đang đọc
  useEffect(() => {
    if (currentLine >= 0 && lineRefs.current[currentLine]) {
      lineRefs.current[currentLine].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentLine])

  if (!content) return <Loading />

  const readingProps = {
    reading,
    onStart: start,
    onStop: stop,
    onPrev: prevLine,
    onNext: nextLine,
    voices,
  }

  return (
    <div>
      <FloatingButton readingProps={readingProps} />
      <div className='content'>
        {lines.map((line, i) => {
          const imgMatch = line.match(/^\[!img\]\((.+)\)$/)
          if (imgMatch) {
            return (
              <img
                key={i}
                ref={(el) => (lineRefs.current[i] = el)}
                src={imgMatch[1]}
                alt={`image-${i}`}
                style={{ width: '100%', margin: '1rem 0' }}
              />
            )
          } else {
            return (
              <Sentence
                key={i}
                ref={(el) => (lineRefs.current[i] = el)}
                text={line}
                highlightWord={i === currentLine ? currentWord : -1}
                isActive={i === currentLine}
                style={setting}
              />
            )
          }
        })}
      </div>
    </div>
  )
}

export default ReaderContent
