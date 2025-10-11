import {
  faBookmark,
  faCalendar,
  faClock,
  faDownload,
  faEye,
  faHeart,
  faList,
  faRss,
  faShareAlt,
  faStar,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { bookshelfAPI } from '../../services/api'
import { timeAgo } from '../../utils/timeAgo'
import { StarRating } from '../../components/StartRating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Description from './Description'
import { useSnackbar } from '../../context/SnackbarContext'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import ImageWithFallback from '../../components/ImageWithFallback'

const StoryInfoSection = ({ storyDetails, genres, progress }) => {
  const [details, setDetails] = useState(storyDetails)
  const [avgRating, setAvgRating] = useState(
    details.reviewCount > 0
      ? (details.totalRating / details.reviewCount).toFixed(1)
      : null,
  )
  const { showSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    setDetails(storyDetails)
    setAvgRating(
      storyDetails.reviewCount > 0
        ? (storyDetails.totalRating / storyDetails.reviewCount).toFixed(1)
        : null,
    )
  }, [storyDetails])

  const handleFollowButton = async () => {
    if (!user.isLoggedIn) {
      showSnackbar({ status: 'warning', message: 'Chưa đăng nhập' })
      return
    }
    const token = user.token
    const res = await bookshelfAPI.addToBookshelf(token, details.id)
    const book = res.book
    setDetails((pre) => ({ ...book, genres: pre.genres }))
    setAvgRating(
      book?.reviewCount > 0
        ? (book.totalRating / book.reviewCount).toFixed(1)
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
          <ImageWithFallback
            className='ratio ratio-2x3 bg-cover bg-center'
            urlAvatar={details.urlAvatar}
          />
        </div>
      </div>

      <div className='m-1 m-md-4 d-flex flex-column col'>
        <p className='fs-2'>{details.title}</p>

        {/* Genres */}
        <div className='d-flex flex-row mb-2 flex-wrap'>
          {details.genres.map((genre, i) => (
            <div
              key={i}
              className={`me-1 mb-1 p-1 rounded fs-7 fs-md-8 cursor-pointer ${styles.genre}`}
              onClick={() =>
                navigate(
                  `/search?genre=${genres.find((g) => g.name === genre)?.id}`,
                )
              }>
              {genre}
            </div>
          ))}
        </div>

        <InfoItem
          label='Đánh giá'
          value={
            avgRating ? (
              <StarRating rating={parseFloat(avgRating)} />
            ) : (
              'Chưa có đánh giá nào'
            )
          }
          icon={faStar}
        />

        <InfoItem
          label='Tác giả'
          value={details.author}
          icon={faUser}
          onClick={() => navigate(`/search?query=${details.author}`)}
        />
        <InfoItem label='Tình trạng' value={details.status} icon={faRss} />
        <InfoItem
          label='Ngày đăng'
          value={new Date(details.publishedDate).toLocaleDateString()}
          icon={faCalendar}
        />

        <div className='d-flex flex-column gap-3'>
          <div className='d-flex flex-row justify-content-between flex-wrap p-3 col col-12 col-md-10 col-lg-8'>
            <div className='btn opacity-hover-50 p-0'>
              <FontAwesomeIcon icon={faHeart} /> {details.like}
            </div>
            <div
              className='btn opacity-hover-50 p-0'
              onClick={handleFollowButton}>
              <FontAwesomeIcon icon={faBookmark} /> {details.followers}
            </div>
            <div className='btn opacity-hover-50 p-0'>
              <FontAwesomeIcon icon={faEye} /> {details.views}
            </div>
            <div className='btn opacity-hover-50 p-0'>
              <FontAwesomeIcon icon={faClock} /> {timeAgo(details.updateAt)}
            </div>
            <div className='btn opacity-hover-50 p-0'>
              <FontAwesomeIcon icon={faList} /> {details.chapterCount}
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
              className='btn btn-warning fs-7 fs-md-8'
              onClick={() => navigate(`/story/${details.id}/chapter/1`)}>
              Đọc từ đầu
            </div>
            {progress?.last_chapter_index && (
              <div
                className='btn btn-success'
                onClick={() =>
                  navigate(
                    `/story/${details.id}/chapter/${progress.last_chapter_index}`,
                  )
                }>
                Tiếp tục
              </div>
            )}
          </div>
        </div>
      </div>

      <Description description={details.description} />
    </div>
  )
}

export default StoryInfoSection
