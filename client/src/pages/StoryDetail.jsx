import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGenres } from '../redux/genreSlice'
import { reviewAPI, bookAPI, progressAPI, bookshelfAPI } from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faBookmark,
  faEye,
  faClock,
  faShareAlt,
  faList,
  faDownload,
  faUser,
  faRss,
  faCalendar,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { CommentItem } from '../components/CommentItem'
import { StarRating } from '../components/StartRating'
import { ReviewForm } from '../components/ReviewForm'
import { useSnackbar } from '../context/SnackbarContext'
import { timeAgo } from '../utils/timeAgo'
import { formatterStoryDetail } from '../utils/formatter'
import styles from './StoryDetail.module.css'

const StoryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [storyDetails, setStoryDetails] = useState(null)
  const [chapters, setChapters] = useState(null)
  const [progress, setProgress] = useState(null)
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)

  const currentUser = useSelector((state) => state.user)
  const genres = useSelector((state) => state.genre.list)
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbar()

  // fetch genres
  useEffect(() => {
    if (!genres.length) dispatch(fetchGenres())
  }, [dispatch, genres.length])

  // fetch story details
  useEffect(() => {
    const fetchData = async () => {
      const data = await bookAPI.getStoryDetails(id)
      setStoryDetails(data)
      setAvgRating(
        data.reviewCount > 0
          ? (data.totalRating / data.reviewCount).toFixed(1)
          : null,
      )
    }
    fetchData()
  }, [id])

  // fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      const data = await bookAPI.getChapters(id)
      setChapters(data)
    }
    fetchChapters()
  }, [id])

  // fetch progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser.token) return
      try {
        const data = await progressAPI.getProgressByBook(currentUser.token, id)
        setProgress(data)
      } catch (err) {
        console.warn('Không có tiến trình đọc:', err)
      }
    }
    fetchProgress()
  }, [currentUser.token, id])

  // fetch reviews
  useEffect(() => {
    const fetchReview = async () => {
      const data = await reviewAPI.getReviewsByBook(id)
      setReviews(data.filter((r) => r.user_id !== currentUser.id))
    }
    fetchReview()
  }, [currentUser.id, id])

  if (!storyDetails || !chapters)
    return (
      <div className='d-flex justify-content-center align-items-center flex-grow-1'>
        <div className='spinner-border text-muted' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    )

  return (
    <div className='container mx-auto p-0 p-top-4 p-end-4 flex-grow-1'>
      <StoryInfoSection
        storyDetails={storyDetails}
        genres={genres}
        avgRating={avgRating}
        progress={progress}
        showSnackbar={showSnackbar}
        navigate={navigate}
        currentUser={currentUser}
        setStoryDetails={setStoryDetails}
        setAvgRating={setAvgRating}
      />
      <StoryChaptersSection
        bookId={id}
        storyDetails={storyDetails}
        chapters={chapters}
        progress={progress}
        navigate={navigate}
      />
      <StoryReviewsSection
        bookId={id}
        reviews={reviews}
        currentUser={currentUser}
      />
    </div>
  )
}

const StoryInfoSection = ({
  storyDetails,
  genres,
  avgRating,
  progress,
  showSnackbar,
  navigate,
  currentUser,
  setStoryDetails,
  setAvgRating,
}) => {
  const handleFollowButton = async () => {
    if (!currentUser.isLoggedIn) {
      showSnackbar({ status: 'warning', message: 'Chưa đăng nhập' })
      return
    }
    const token = currentUser.token
    const res = await bookshelfAPI.addToBookshelf(token, storyDetails.id)
    const formatted = formatterStoryDetail(res.book)
    setStoryDetails((pre) => ({ ...formatted, genres: pre.genres }))
    setAvgRating(
      formatted?.reviewCount > 0
        ? (formatted.totalRating / formatted.reviewCount).toFixed(1)
        : null,
    )
    showSnackbar(res)
  }

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      showSnackbar({ message: 'Đã copy link: ' + text })
    } catch (err) {
      console.warn(err)
      showSnackbar({ status: 'error', message: 'Copy thất bại' })
    }
    document.body.removeChild(textArea)
  }

  const handleShareClick = () => {
    const url = window.location.origin + window.location.pathname
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(url)
        .then(() => showSnackbar({ message: 'Đã copy link: ' + url }))
        .catch(() => fallbackCopyTextToClipboard(url))
    } else {
      fallbackCopyTextToClipboard(url)
    }
  }

  const InfoItem = ({ label, value, icon, onClick }) => (
    <div className='row'>
      <label className='m-0 fw-bold opacity-75 col col-6 col-md-4 col-lg-3'>
        <FontAwesomeIcon icon={icon} /> {label}
      </label>
      <span
        onClick={onClick}
        className={`m-0 opacity-75 col ${
          onClick ? 'cursor-pointer text-hover-blue' : ''
        }`}>
        {value}
      </span>
    </div>
  )

  return (
    <div className='row mb-4'>
      <div className='col col-12 col-md-4 col-lg-3 d-flex align-items-center justify-content-center'>
        <div className='w-50 w-md-100'>
          <div
            className='ratio ratio-2x3 bg-cover bg-center'
            style={{
              backgroundImage: `url(${storyDetails.urlAvatar})`,
            }}></div>
        </div>
      </div>

      <div className='m-4 d-flex flex-column col'>
        <p className='fs-2'>{storyDetails.title}</p>

        {/* Genres */}
        <div className='d-flex flex-row mb-2 flex-wrap'>
          {storyDetails.genres.map((genre, i) => (
            <div
              key={i}
              className={`badge me-1 mb-1 p-2 ${styles['genre-badge']}`}
              onClick={() =>
                navigate(
                  `/search?genre=${genres.find((g) => g.name === genre)?.id}`,
                )
              }>
              {genre}
            </div>
          ))}
        </div>

        {avgRating && (
          <InfoItem
            label='Đánh giá'
            value={<StarRating rating={parseFloat(avgRating)} />}
            icon={faStar}
          />
        )}

        <InfoItem
          label='Tác giả'
          value={storyDetails.author}
          icon={faUser}
          onClick={() => navigate(`/search?query=${storyDetails.author}`)}
        />
        <InfoItem label='Tình trạng' value={storyDetails.status} icon={faRss} />
        <InfoItem
          label='Ngày đăng'
          value={new Date(storyDetails.publishedDate).toLocaleDateString()}
          icon={faCalendar}
        />

        <div className='d-flex flex-column gap-3'>
          <div className='d-flex flex-row justify-content-between flex-wrap p-3 col col-12 col-md-10 col-lg-8'>
            <div className='btn opacity-hover-50 p-0'>
              <FontAwesomeIcon icon={faHeart} /> {storyDetails.like}
            </div>
            <div
              className='btn opacity-hover-50 p-0'
              onClick={handleFollowButton}>
              <FontAwesomeIcon icon={faBookmark} /> {storyDetails.followers}
            </div>
            <div className='btn opacity-hover-50 p-0'>
              <FontAwesomeIcon icon={faEye} /> {storyDetails.views}
            </div>
            <div className='btn opacity-hover-50 p-0'>
              <FontAwesomeIcon icon={faClock} />{' '}
              {timeAgo(storyDetails.updateAt)}
            </div>
            <div className='btn opacity-hover-50 p-0'>
              <FontAwesomeIcon icon={faList} /> {storyDetails.chapterCount}
            </div>
            <div className='btn opacity-hover-50 p-0'>
              <FontAwesomeIcon icon={faDownload} />
            </div>
            <div
              className='btn opacity-hover-50 p-0'
              onClick={handleShareClick}>
              <FontAwesomeIcon icon={faShareAlt} />
            </div>
          </div>

          <div className='d-flex flex-row gap-2 flex-wrap'>
            <div
              className='btn btn-warning text-white'
              onClick={() => navigate(`/story/${storyDetails.id}/chapter/1`)}>
              Đọc từ đầu
            </div>
            {progress?.last_chapter_index && (
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

      <Description description={storyDetails.description} />
    </div>
  )
}

const StoryChaptersSection = ({
  storyDetails,
  chapters,
  progress,
  navigate,
}) => {
  const [showAll, setShowAll] = useState(false)
  const visibleDefault = 30

  const ChapterItem = ({ chapter }) => {
    let classNames = `p-1 rounded ${styles.chapterItem} `
    if (progress) {
      if (chapter.index < progress.last_chapter_index)
        classNames += styles.readChapter
      else if (chapter.index === progress.last_chapter_index)
        classNames += styles.currentChapter
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

  return (
    <div className='mb-4'>
      <h3>Danh sách chương</h3>
      <div className='position-relative'>
        <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3 mb-3'>
          {chapters.map((chapter, index) => (
            <div
              key={chapter.chapterId}
              className={`col ${
                visibleDefault > index || showAll ? '' : 'd-none'
              }`}>
              <ChapterItem chapter={chapter} />
            </div>
          ))}
        </div>
        {visibleDefault < chapters.length && !showAll && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4rem',
              background:
                'linear-gradient(180deg, rgba(var(--color-container-background-rgb), 0) 0%, rgba(var(--color-container-background-rgb), 0.75) 75%, rgba(var(--color-container-background-rgb), 1) 100%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {visibleDefault < chapters.length && !showAll && (
        <div className='text-center w-100'>
          <div
            className='btn opacity-hover-50'
            onClick={() => setShowAll(true)}>
            Xem thêm
          </div>
        </div>
      )}
    </div>
  )
}

const StoryReviewsSection = ({ bookId, reviews, currentUser }) => (
  <div className='mb-4'>
    <ReviewForm bookId={bookId} />
    {reviews?.length !== 0 && (
      <>
        <p className='fw-bold'>Đánh giá của người khác:</p>
        {reviews
          .filter((r) => r.userId !== currentUser.id)
          .map((review) => (
            <CommentItem key={review.id} comment={review} />
          ))}
      </>
    )}
  </div>
)

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

export default StoryDetail
