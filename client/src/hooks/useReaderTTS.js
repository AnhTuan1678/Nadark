import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setReaderSpeed, setReaderVoice } from '../redux/settingSlice'

export function useReaderTTS(content, onEnd) {
  const dispatch = useDispatch()
  const autoSpeed = useSelector((state) => state.setting.reader.autoNextChapter)
  const speed = useSelector((state) => state.setting.reader.speed)
  const voiceName = useSelector((state) => state.setting.reader.voiceName)

  const [lines, setLines] = useState(content?.content?.split('\n').filter(Boolean) || [])
  const [reading, setReading] = useState(false)
  const [currentLine, setCurrentLine] = useState(-1)
  const [currentWord, setCurrentWord] = useState(-1)
  const [voices, setVoices] = useState([])
  const [voiceReady, setVoiceReady] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const voice = voices.find((v) => v.name === voiceName) || null

  const queueRef = useRef([])        // Queue các dòng cần đọc
  const lineIndexRef = useRef(0)     // Dòng hiện tại trong queue
  const readingRef = useRef(reading)
  const currentLineRef = useRef(currentLine)
  const linesRef = useRef(lines)

  // Update refs
  useEffect(() => { readingRef.current = reading }, [reading])
  useEffect(() => { currentLineRef.current = currentLine }, [currentLine])
  useEffect(() => { linesRef.current = lines }, [lines])

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices().filter((v) => v.lang.includes('vi'))
      setVoices(available)

      let selectedVoice = available[0]
      if (voiceName) {
        const match = available.find((v) => v.name === voiceName)
        if (match) selectedVoice = match
      }

      if (selectedVoice && selectedVoice.name !== voiceName) {
        dispatch(setReaderVoice(selectedVoice.name))
      }

      if (selectedVoice) setVoiceReady(true)
    }

    window.speechSynthesis.onvoiceschanged = loadVoices
    loadVoices()
    return () => window.speechSynthesis.cancel()
  }, [voiceName, dispatch])

  // Check nếu dòng chỉ có ký tự đặc biệt → bỏ qua
  const isSpecialLine = (line) => !line.trim() || /^[\s=.\-_,!@#$%^&*()]+$/.test(line)

  // Reset khi content thay đổi → luôn đọc từ đầu nếu autoSpeed
  useEffect(() => {
    const newLines = content?.content?.split('\n').filter(Boolean) || []
    setLines(newLines)
    setCurrentLine(-1)
    setCurrentWord(-1)

    if (autoSpeed && newLines.length > 0 && voice && voiceReady && hasStarted) {
      start(newLines, 0)
    }
  }, [content, voice, voiceReady, hasStarted, autoSpeed])

  // Khi voice hoặc speed thay đổi → áp dụng ngay cho dòng hiện tại
  useEffect(() => {
    if (readingRef.current && currentLineRef.current >= 0) {
      window.speechSynthesis.cancel()
      queueRef.current = linesRef.current.slice(currentLineRef.current)
      lineIndexRef.current = currentLineRef.current
      speakNextLine()
    }
  }, [voice, speed])

  const start = (linesArray = lines, fromIndex = 0) => {
    if (!linesArray || linesArray.length === 0) return
    if (!Number.isInteger(fromIndex) || fromIndex < 0) fromIndex = 0

    window.speechSynthesis.cancel()
    setReading(true)
    setHasStarted(true)

    queueRef.current = linesArray.slice(fromIndex)
    lineIndexRef.current = fromIndex
    speakNextLine()
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setReading(false)
    setCurrentWord(-1)
    queueRef.current = []
  }

  const prevLine = () => {
    if (currentLine > 0) {
      window.speechSynthesis.cancel()
      const newIndex = currentLine - 1
      setCurrentLine(newIndex)
      setReading(true)
      setCurrentWord(-1)
      queueRef.current = lines.slice(newIndex)
      lineIndexRef.current = newIndex
      speakNextLine()
    }
  }

  const nextLine = () => {
    if (currentLine < lines.length - 1) {
      window.speechSynthesis.cancel()
      const newIndex = currentLine + 1
      setCurrentLine(newIndex)
      setReading(true)
      setCurrentWord(-1)
      queueRef.current = lines.slice(newIndex)
      lineIndexRef.current = newIndex
      speakNextLine()
    }
  }

  const speakNextLine = () => {
    if (!queueRef.current || queueRef.current.length === 0) {
      setReading(false)
      setCurrentLine(-1)
      setCurrentWord(-1)
      if (onEnd) onEnd()
      return
    }

    const line = queueRef.current.shift()
    lineIndexRef.current += 1

    if (!line || isSpecialLine(line)) return speakNextLine()

    const imgMatch = line.match(/^\[!img\]\((.+)\)$/)
    if (imgMatch) return speakNextLine()

    const utter = new SpeechSynthesisUtterance(line)
    utter.lang = voice?.lang || 'vi-VN'
    utter.voice = voice
    utter.rate = speed

    utter.onstart = () => {
      setCurrentLine(lineIndexRef.current - 1)
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
      speakNextLine()
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
