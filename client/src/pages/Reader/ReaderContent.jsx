import { useState, useEffect } from 'react'
import Loading from '../../components/Loading'
import Sentence from './Sentence'
import FloatingButton from './FloatingButton'

function ReaderContent({ content, setting }) {
  const lines = content?.content?.split('\n').filter(Boolean)
  const [reading, setReading] = useState(false)
  const [currentLine, setCurrentLine] = useState(-1)
  const [currentWord, setCurrentWord] = useState(-1)

  // đọc từ localStorage nếu có
  const [speed, setSpeed] = useState(() => {
    return Number(localStorage.getItem('reader-speed')) || 1
  })
  const [voice, setVoice] = useState(null)
  const [voices, setVoices] = useState([])

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis
        .getVoices()
        .filter((v) => v.lang.includes('vi'))
      setVoices(available)

      const savedVoiceName = localStorage.getItem('reader-voice')
      let selectedVoice = available[0]
      if (savedVoiceName) {
        const match = available.find((v) => v.name === savedVoiceName)
        if (match) selectedVoice = match
      }

      if (!voice && selectedVoice) setVoice(selectedVoice)
    }

    window.speechSynthesis.onvoiceschanged = loadVoices
    loadVoices()
    return () => window.speechSynthesis.cancel()
  }, [voice])

  // lưu speed vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('reader-speed', speed)
  }, [speed])

  // lưu voice vào localStorage khi thay đổi
  useEffect(() => {
    if (voice) {
      localStorage.setItem('reader-voice', voice.name)
    }
  }, [voice])

  if (!content) return <Loading />

  const speakLine = (index) => {
    if (index >= lines.length) {
      setReading(false)
      setCurrentLine(-1)
      setCurrentWord(-1)
      return
    }

    const line = lines[index]
    const imgMatch = line.match(/^\[!img\]\((.+)\)$/)
    if (imgMatch) {
      speakLine(index + 1)
      return
    }

    const utter = new SpeechSynthesisUtterance(line)
    utter.lang = voice?.lang || 'vi-VN'
    utter.voice = voice
    utter.rate = speed

    utter.onstart = () => {
      setCurrentLine(index)
      setCurrentWord(-1)
    }

    utter.onboundary = (e) => {
      if (e.name === 'word' || e.name === 'sentence') {
        const spokenPart = line.slice(0, e.charIndex + 1)
        const wordIndex = spokenPart.trim().split(/\s+/).length - 1
        setCurrentWord(wordIndex)
      }
    }

    utter.onend = () => {
      setCurrentWord(-1)
      speakLine(index + 1)
    }

    window.speechSynthesis.speak(utter)
  }

  const start = () => {
    if (reading) return
    window.speechSynthesis.cancel()
    setReading(true)
    setTimeout(() => speakLine(currentLine >= 0 ? currentLine : 0), 100)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setReading(false)
    setCurrentWord(-1)
  }

  const prevLine = () => {
    if (currentLine > 0) {
      window.speechSynthesis.cancel()
      const newIndex = currentLine - 1
      setCurrentLine(newIndex)
      setReading(true)
      setCurrentWord(-1)
      setTimeout(() => speakLine(newIndex), 100)
    }
  }

  const nextLine = () => {
    if (currentLine < lines.length - 1) {
      window.speechSynthesis.cancel()
      const newIndex = currentLine + 1
      setCurrentLine(newIndex)
      setReading(true)
      setCurrentWord(-1)
      setTimeout(() => speakLine(newIndex), 100)
    }
  }

  const readingProps = {
    reading,
    onStart: start,
    onStop: stop,
    onPrev: prevLine,
    onNext: nextLine,
    speed,
    onSpeedChange: setSpeed,
    voice,
    onVoiceChange: setVoice,
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
                src={imgMatch[1]}
                alt={`image-${i}`}
                style={{ maxWidth: '100%' }}
              />
            )
          } else {
            return (
              <Sentence
                key={i}
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
