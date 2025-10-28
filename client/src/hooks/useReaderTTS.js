import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setReaderSpeed, setReaderVoice } from '../redux/settingSlice'

export function useReaderTTS(content) {
  const dispatch = useDispatch()
  const autoSpeed = useSelector((state) => state.setting.reader.autoNextChapter)

  // State
  const [lines, setLines] = useState(
    content?.content?.split('\n').filter(Boolean) || [],
  )
  const [reading, setReading] = useState(false)
  const [currentLine, setCurrentLine] = useState(-1)
  const [currentWord, setCurrentWord] = useState(-1)
  const [voices, setVoices] = useState([])

  // Redux
  const speed = useSelector((state) => state.setting.reader.speed)
  const voiceName = useSelector((state) => state.setting.reader.voiceName)
  const voice = voices.find((v) => v.name === voiceName) || null

  // Controls
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

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis
        .getVoices()
        .filter((v) => v.lang.includes('vi'))
      setVoices(available)

      let selectedVoice = available[0]
      if (voiceName) {
        const match = available.find((v) => v.name === voiceName)
        if (match) selectedVoice = match
      }

      if (selectedVoice && selectedVoice.name !== voiceName) {
        dispatch(setReaderVoice(selectedVoice.name))
      }
    }

    window.speechSynthesis.onvoiceschanged = loadVoices
    loadVoices()

    return () => window.speechSynthesis.cancel()
  }, [voiceName, dispatch])

  // Reset when content changes
  useEffect(() => {
    setCurrentLine(-1)
    setCurrentWord(-1)
    setReading(false)
    setLines(content?.content?.split('\n').filter(Boolean) || [])
    window.speechSynthesis.cancel()

    if (autoSpeed) {
      start()
    }
  }, [autoSpeed, content])

  // Speak one line
  const speakLine = (index) => {
    if (index >= lines.length) {
      setReading(false)
      setCurrentLine(-1)
      setCurrentWord(-1)
      return
    }

    const line = lines[index]
    const imgMatch = line.match(/^\[!img\]\((.+)\)$/)
    if (imgMatch) return speakLine(index + 1)

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

  return {
    lines,
    reading,
    currentLine,
    currentWord,
    speed,
    voice,
    voices,
    start,
    stop,
    prevLine,
    nextLine,
    setSpeed: (s) => dispatch(setReaderSpeed(s)),
    setVoice: (v) => dispatch(setReaderVoice(v?.name || null)),
  }
}
