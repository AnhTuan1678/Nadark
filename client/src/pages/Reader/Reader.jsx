import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { commentAPI, bookAPI, progressAPI, userAPI } from '../../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './styles.module.css'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import TableOfContents from './TableOfContents'
import { useSelector } from 'react-redux'
import { timeAgo } from '../../utils/timeAgo'
import { useSnackbar } from '../../context/SnackbarContext'
import SettingsPopup from './SettingsPopup'
import ReaderContent from './ReaderContent'
import CommentSection from './CommentSection'
import ChapterNavigation from './ChapterNavigation'

const Reader = () => {
  const defaultSetting = {
    fontSize: '18px',
    fontFamily: 'Times New Roman',
    lineHeight: 1.5,
    zoom: 1,
  }

  const { chapterIndex, id } = useParams(1)
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const { showSnackbar } = useSnackbar()

  const [content, setContent] = useState('')
  const [storyDetails, setStoryDetails] = useState({})
  const [showSettings, setShowSettings] = useState(false)
  const [setting, setSetting] = useState(defaultSetting)
  const [showTOC, setShowTOC] = useState(false)
  const [comments, setComments] = useState([])

  const [showNav, setShowNav] = useState(true)
  const contentRef = useRef(null)

  // Lấy nội dung chương
  useEffect(() => {
    const fetchContent = async () => {
      const data = await bookAPI.getChapterContent(chapterIndex, id)
      const comments = await commentAPI.getCommentsByChapter(data.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setContent(data)
      setComments(comments)
    }

    // Lưu tiến trình đọc khi load chương
    if (user.token) {
      try {
        progressAPI.saveProgress(user.token, id, chapterIndex, 0)
      } catch (err) {
        console.error('Lỗi khi lưu tiến trình:', err)
      }
    }

    fetchContent()
  }, [chapterIndex, id, user.token])

  // Lấy thông tin sách
  useEffect(() => {
    const fetchStoryDetails = async () => {
      const data = await bookAPI.getStoryDetails(id)
      setStoryDetails(data)
    }

    fetchStoryDetails()
  }, [id])

  // Lấy setting
  useEffect(() => {
    const fetchUserSettings = async () => {
      const token = user.token
      if (user.isLoggedIn) {
        const profile = await userAPI.getProfile(token)
        if (profile.personal_settings) {
          const defaultSetting = {
            fontSize: '18px',
            fontFamily: 'Times New Roman',
            lineHeight: 1.5,
            zoom: 1,
          }
          const merged = { ...defaultSetting, ...profile.personal_settings }

          setSetting(merged)
        }
      }
    }

    fetchUserSettings()
  }, [user])

  // Đổi màu body
  useEffect(() => {
    const prevColor = document.body.style.backgroundColor
    document.body.style.backgroundColor = 'var(--color-chapter-background)'
    return () => {
      document.body.style.backgroundColor = prevColor
    }
  }, [])

  // Tính toán việc hiển thị thanh nav trên điện thoại
  // Nếu scroll gần hết content => ẩn
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const rect = contentRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // rect.bottom là khoảng cách từ top viewport tới bottom content
      if (rect.bottom - windowHeight < 50) {
        // Gần cuối content → ẩn
        setShowNav(false)
      } else {
        // Ở giữa → hiện
        setShowNav(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // kiểm tra khi mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSendComment = async (message, parentId = null) => {
    if (!message || !message.trim()) return

    const token = user.token
    if (!token) {
      showSnackbar({ status: 'error', message: 'Chưa đăng nhập' })
    }
    const res = await commentAPI.createComment(
      token,
      content.id,
      message,
      parentId,
    )
    res.User = { ...user, avatar_url: user.avatarUrl }

    setComments([res, ...comments]) // thêm vào đầu
  }

  const handleDeleteComment = async (token, commentId) => {
    try {
      const res = await commentAPI.deleteComment(token, commentId)
      showSnackbar(res)
      setComments((prevComments) =>
        prevComments.filter(
          (c) => c.id !== commentId && c.parent_id !== commentId,
        ),
      )
    } catch (error) {
      console.log(error)
      showSnackbar({ status: 'error', message: 'Xoá comment thất bại' })
    }
  }

  return (
    <>
      <div className='container mx-auto flex-grow-1'>
        {showTOC && (
          <TableOfContents
            bookId={id}
            onClose={() => setShowTOC(false)}
            currentIndex={chapterIndex}
          />
        )}
        {showSettings && (
          <SettingsPopup
            defaultSetting={setting || defaultSetting}
            onClose={() => setShowSettings(false)}
            onSave={(set) => setSetting(set)}
            onChange={(set) => setSetting(set)}
          />
        )}

        {storyDetails && (
          <div className='text-center'>
            <h2
              className={`mb-0 cursor-pointer opacity-hover-50 bg-transparent fs-4 fw-bold ${styles.title}`}
              onClick={() => navigate(`/story/${storyDetails.id}`)}>
              {storyDetails.title}
            </h2>
          </div>
        )}

        <h5 className={`text-center mb-0 fw-bold fs-6 ${styles.title}`}>
          Chương {content.index}: {content.title}
        </h5>
        <h6 className={`text-center fw-bold fs-7 mb-4 ${styles.title}`}>
          Cập nhật: {timeAgo(content.created_at)} - Độ dài: {content.word_count}{' '}
          từ
        </h6>

        <div ref={contentRef} className='row'>
          <ReaderContent content={content} setting={setting} />
        </div>

        <div
          className={
            'justify-content-between mt-4 chapter-nav d-flex border rounded bg-transparent p-2 mb-5'
          }>
          <ChapterNavigation
            storyDetails={storyDetails}
            chapterIndex={chapterIndex}
            setShowTOC={setShowTOC}
            setShowSettings={setShowSettings}
          />
        </div>

        <CommentSection
          comments={comments}
          handleSendComment={handleSendComment}
          handleDeleteComment={handleDeleteComment}
        />
      </div>

      {/* thanh nav bottom của điện thoại */}
      {showNav && (
        <div
          className={
            'justify-content-between mt-4 chapter-nav d-flex rounded bg-transparent p-2 position-fixed start-0 bottom-0 end-0'
          }>
          <ChapterNavigation
            storyDetails={storyDetails}
            chapterIndex={chapterIndex}
            setShowTOC={setShowTOC}
            setShowSettings={setShowSettings}
            className={'d-md-none d-block'}
          />
          <button
            className='btn btn-primary d-md-none d-block'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      )}

      <div className='position-fixed bottom-0 end-0 p-4 d-md-flex d-none flex-column gap-2'>
        <ChapterNavigation
          storyDetails={storyDetails}
          chapterIndex={chapterIndex}
          setShowTOC={setShowTOC}
          setShowSettings={setShowSettings}
        />
        <button
          className='btn btn-primary'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
    </>
  )
}

export default Reader
