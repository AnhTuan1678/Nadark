import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  getStoryDetails,
  getChapters,
  getProgressByBook,
  addToBookshelf,
} from '../services/api'
import styles from './StoryDetail.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faBookmark,
  faEye,
  faFlag,
} from '@fortawesome/free-solid-svg-icons'
import Snackbar from '../components/SnackBar'
import { formatterStoryDetail } from '../utils/formatter'

const StoryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [storyDetails, setStoryDetails] = useState(null)
  const [chapters, setChapters] = useState(null)
  const [progress, setProgress] = useState(null)
  const [snack, setSnack] = useState(null)

  const [showAllChapters, setShowAllChapters] = useState(false)

  const visibleChaptersDefault = 30

  // ======= Bình luận =======
  const currentUser = {
    id: 99,
    username: 'Bạn đọc A',
    avatarUrl: 'https://i.pravatar.cc/40?img=10',
  }

  const [fakeComments, setFakeComments] = useState([
    {
      id: 1,
      userId: 2,
      username: 'Hồng Hoa',
      avatarUrl: 'https://i.pravatar.cc/40?img=1',
      content: 'Truyện rất hay, mình mong chờ chương mới!',
    },
    {
      id: 2,
      userId: 3,
      username: 'Long Vũ',
      avatarUrl: 'https://i.pravatar.cc/40?img=2',
      content: 'Tác giả viết mạch lạc, dễ hiểu. Up chương đều tay nhé!',
    },
    {
      id: 3,
      userId: 4,
      username: 'Mai Lan',
      avatarUrl: 'https://i.pravatar.cc/40?img=3',
      content: 'Nhân vật chính hơi bị OP nhưng đọc vẫn cuốn 😍',
    },
  ])

  const [myComment, setMyComment] = useState(
    fakeComments.find((c) => c.userId === currentUser.id) || null,
  )
  const [newComment, setNewComment] = useState('')

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl,
      content: newComment,
    }

    setFakeComments((prev) => [comment, ...prev])
    setMyComment(comment)
    setNewComment('')
  }

  // lấy thông tin sách
  useEffect(() => {
    const fetchData = async () => {
      const data = await getStoryDetails(id)
      setStoryDetails(data)
    }

    fetchData()
  }, [id])

  // lấy danh sách chương
  useEffect(() => {
    const fetchChapters = async () => {
      const chapterData = await getChapters(id)
      setChapters(chapterData)
      setShowAllChapters(chapterData.length <= visibleChaptersDefault)
    }

    fetchChapters()
  }, [id])

  // lấy tiến trình đọc
  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const data = await getProgressByBook(token, id)
          setProgress(data)
        } catch (err) {
          console.warn('Chưa có tiến trình đọc hoặc lỗi:', err)
        }
      }
    }
    fetchProgress()
  }, [id])

  const handleFollowButton = async () => {
    const token = localStorage.getItem('token')
    const res = await addToBookshelf(token, id)
    setSnack(res)
    setStoryDetails(formatterStoryDetail(res.book))
  }

  const InfoItem = ({ label, value }) => {
    return (
      <div>
        <label className='me-2 fw-bold'>{label}:</label>
        <span>{value}</span>
      </div>
    )
  }

  const ChapterItem = ({ chapter }) => {
    let classNames = `p-1 rounded ${styles.chapterItem} `

    if (progress) {
      if (chapter.index < progress.last_chapter_index) {
        classNames += styles.readChapter // đã đọc → mờ
      } else if (chapter.index === progress.last_chapter_index) {
        classNames += styles.currentChapter // đang đọc → highlight
      }
    }

    return (
      <div
        className={classNames}
        onClick={() =>
          navigate(`/story/${storyDetails.id}/chapter/${chapter.index}`)
        }>
        Chương {chapter.index}: {chapter.title}
      </div>
    )
  }

  const CommentItem = ({ comment }) => (
    <div className='d-flex mb-3'>
      <img
        src={comment.avatarUrl}
        alt={comment.username}
        className='rounded-circle me-3'
        width={40}
        height={40}
      />
      <div>
        <p className='mb-1 fw-bold'>{comment.username}</p>
        <p className='mb-0'>{comment.content}</p>
      </div>
    </div>
  )

  return (
    <div className='container mx-auto p-4 flex-grow-1'>
      {snack && (
        <Snackbar
          status={snack.status}
          message={snack.message}
          onClose={() => setSnack(null)}
        />
      )}
      {storyDetails && (
        <div className='d-flex flex-column p-1 p-md-4 border rounded'>
          <div className='d-flex flex-column flex-md-row mb-4 align-items-center'>
            <img
              className={styles['story-image']}
              src={storyDetails.urlAvatar}
              alt={storyDetails.title}
            />
            <div className='m-4 d-flex flex-column flex-grow-1'>
              <p className='fs-3 fw-bold'>{storyDetails.title}</p>
              <div className='d-flex flex-row mb-2 flex-wrap'>
                {storyDetails.genres.map((genre, index) => (
                  <div
                    key={index}
                    className={`badge me-1 mb-1 p-2 ${styles['genre-badge']} `}
                    title={genre}>
                    {genre}
                  </div>
                ))}
              </div>
              <div>
                <InfoItem label='Tác giả' value={storyDetails.author} />
              </div>
              <InfoItem label='Trạng thái' value={storyDetails.status} />
              <InfoItem label='Ngày đăng' value={storyDetails.publishedDate} />
              <div className='d-flex flex-column gap-3'>
                <div className='d-flex flex-row justify-content-between flex-wrap'>
                  <div className={`btn ${styles['cus-btn']}`}>
                    <FontAwesomeIcon icon={faHeart} /> {storyDetails.like}
                  </div>
                  <div
                    className={`btn ${styles['cus-btn']}`}
                    onClick={handleFollowButton}>
                    <FontAwesomeIcon icon={faBookmark} />{' '}
                    {storyDetails.followers}
                  </div>
                  <div className={`btn ${styles['cus-btn']}`}>
                    <FontAwesomeIcon icon={faEye} /> {storyDetails.views}
                  </div>
                  <div className={`btn ${styles['cus-btn']}`}>
                    <FontAwesomeIcon icon={faFlag} />
                  </div>
                </div>

                <div className='d-flex flex-row gap-2 flex-wrap'>
                  <div
                    className='btn btn-warning'
                    onClick={() =>
                      navigate(`/story/${storyDetails.id}/chapter/1`)
                    }>
                    Đọc từ đầu
                  </div>
                  {progress && progress.last_chapter_index && (
                    <div
                      className='btn btn-success'
                      onClick={() =>
                        navigate(
                          `/story/${storyDetails.id}/chapter/${progress.last_chapter_index}`,
                        )
                      }>
                      Tiếp tục
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='border-top border-3 pt-3 border-secondary'>
            <p className='fw-bold'>Tóm tắt:</p>
            {storyDetails.description
              ?.split('\n')
              .filter((line) => line.trim() !== '')
              .map((line, i) => (
                <p key={i} className='fw-lighter fst-italic'>
                  {line}
                </p>
              ))}
          </div>
        </div>
      )}
      {chapters && (
        <div className='d-flex flex-column mb-4 p-4 border rounded'>
          <h3>Chapters</h3>
          <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3'>
            {chapters.map((chapter, index) => (
              <div
                className={`col ${
                  visibleChaptersDefault > index || showAllChapters
                    ? ''
                    : 'd-none'
                }`}
                key={chapter.chapterId}>
                <ChapterItem chapter={chapter} />
              </div>
            ))}
            {visibleChaptersDefault < chapters.length && !showAllChapters && (
              <div className='text-center mt-3 w-100'>
                <button
                  className='btn btn-light'
                  onClick={() => setShowAllChapters(true)}>
                  Xem thêm
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Bình luận */}
      <div className='d-flex flex-column mb-4 p-4 border rounded'>
        <h3>Bình luận</h3>

        {/* Nếu đã có bình luận của mình */}
        {myComment ? (
          <div className='mb-4'>
            <p className='fw-bold'>Bình luận của bạn:</p>
            <CommentItem comment={myComment} />
          </div>
        ) : (
          <div className='mb-4'>
            <textarea
              className='form-control mb-2'
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='Viết bình luận của bạn...'
            />
            <button className='btn btn-primary' onClick={handleAddComment}>
              Gửi
            </button>
          </div>
        )}

        <p className='fw-bold'>Bình luận khác:</p>
        {fakeComments
          .filter((c) => c.userId !== currentUser.id)
          .map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
      </div>
    </div>
  )
}

export default StoryDetail
