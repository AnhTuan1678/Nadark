import { CommentItem } from '../../components/CommentItem'
import ReviewForm from './ReviewForm'
import { useSelector } from 'react-redux'

const StoryReviewsSection = ({ bookId, reviews }) => {
  const user = useSelector((state) => state.user)
  const myReview = reviews.find((r) => r.User.id === user.id)

  return (
    <div className='mb-4'>
      <ReviewForm bookId={bookId} initialReview={myReview} />
      {reviews?.length !== 0 && (
        <>
          <p className='fw-bold'>Đánh giá của người khác:</p>
          {reviews
            .filter((r) => r.User.id !== user.id)
            .map((review) => (
              <CommentItem key={review.id} comment={review} />
            ))}
        </>
      )}
    </div>
  )
}

export default StoryReviewsSection
