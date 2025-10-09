import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState, useEffect } from 'react'
import { CommentItem } from '../../components/CommentItem'
import { reviewAPI } from '../../services/api'
import { useSelector } from 'react-redux'
import { useSnackbar } from '../../context/SnackbarContext'

// Component chọn sao đánh giá
const StarSelector = ({ rating, setRating, totalStars = 5, fixed = false }) => {
  return (
    <div className='mb-2'>
      {Array.from({ length: totalStars }).map((_, i) => {
        const starValue = i + 1
        const currentStar = rating
        return (
          <FontAwesomeIcon
            key={i}
            icon={faStarSolid}
            style={{
              color: starValue <= currentStar ? '#ffc107' : '#838383ff',
              cursor: fixed ? 'default' : 'pointer',
              marginRight: 2,
            }}
            onMouseEnter={() => !fixed && setRating(starValue)}
            onClick={() => !fixed && setRating(starValue)}
          />
        )
      })}
    </div>
  )
}

// Form đánh giá truyện
const ReviewForm = ({ bookId, initialReview }) => {
  const [review, setReview] = useState(initialReview || null)
  const [newReview, setNewReview] = useState(initialReview?.content || '')
  const [rating, setRating] = useState(initialReview?.rating || 5)
  const [editing, setEditing] = useState(false)

  const textareaRef = useRef(null)
  const { showSnackbar } = useSnackbar()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
      const length = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [editing])

  const handleAddReview = async ({ content = '', rating }) => {
    if (!content.trim()) return
    if (!user.isLoggedIn) {
      showSnackbar({ message: 'Chưa đăng nhập', status: 'warning' })
      return
    }
    try {
      const res = await reviewAPI.createReview(
        user.token,
        bookId,
        content,
        rating,
      )
      res.User = { ...user, avatar_url: user.avatarUrl }
      setReview(res)
      showSnackbar({ message: 'Đã gửi đánh giá', status: 'success' })
      setEditing(false)
    } catch (err) {
      showSnackbar({ message: 'Gửi thất bại', status: 'error' })
      console.log(err)
    }
  }

  const handleSaveReview = async ({ content, rating, reviewId }) => {
    if (!content.trim()) return
    if (!user.isLoggedIn) {
      showSnackbar({ message: 'Chưa đăng nhập', status: 'warning' })
      return
    }
    try {
      const res = await reviewAPI.updateReview(
        user.token,
        reviewId,
        content,
        rating,
      )
      res.User = { ...user, avatar_url: user.avatarUrl }
      setReview(res)
      showSnackbar({ message: 'Đã lưu thay đổi', status: 'success' })
      setEditing(false)
    } catch (err) {
      showSnackbar({ message: 'Cập nhật thất bại', status: 'error' })
      console.log(err)
    }
  }

  const handleDeleteReview = async (id) => {
    if (!id) return
    try {
      const res = await reviewAPI.deleteReview(user.token, id)
      showSnackbar(res)
      setReview(null)
      setNewReview('')
      setRating(5)
      setEditing(true)
    } catch (err) {
      showSnackbar({ message: 'Xoá thất bại', status: 'error' })
      console.log(err)
    }
  }

  return (
    <div className='mb-4'>
      {review && !editing ? (
        // 🔸 Hiển thị bình luận hiện có
        <div className='mb-4 border p-1 p-md-3 shadow-sm rounded'>
          <StarSelector rating={review.rating} setRating={setRating} fixed />
          <CommentItem comment={review} />
          <div className='pt-2 ps-5'>
            <button
              className='btn btn-sm btn-outline-primary me-2'
              onClick={() => {
                setEditing(true)
                setNewReview(review.content)
                setRating(review.rating)
              }}>
              Sửa
            </button>
            <button
              className='btn btn-sm btn-outline-danger'
              onClick={() => handleDeleteReview(review.id)}>
              Xoá
            </button>
          </div>
        </div>
      ) : (
        // 🔸 Hiển thị form nhập hoặc chỉnh sửa
        <div className='mb-4'>
          <StarSelector rating={rating} setRating={setRating} />
          <textarea
            className='form-control mb-2'
            rows={3}
            ref={textareaRef}
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder='Viết đánh giá của bạn...'
          />
          {review ? (
            <>
              <button
                className={`btn btn-outline-success me-2 ${
                  newReview === review?.content && rating === review?.rating
                    ? 'disabled'
                    : ''
                }`}
                onClick={() =>
                  handleSaveReview({
                    content: newReview,
                    rating,
                    reviewId: review.id,
                  })
                }>
                Lưu
              </button>
              <button
                className='btn btn-outline-warning'
                onClick={() => {
                  setNewReview(review?.content || '')
                  setRating(review?.rating || 5)
                  setEditing(false)
                }}>
                Huỷ
              </button>
            </>
          ) : (
            <button
              className={`btn btn-primary ${
                newReview.trim() === '' ? 'disabled' : ''
              }`}
              onClick={() => handleAddReview({ content: newReview, rating })}>
              Gửi
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ReviewForm
