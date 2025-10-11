import EmptyState from '../../components/EmptyState'
import StoryCard from '../../components/StoryCard'

const StoriesPosted = ({ stories }) => {
  if (!stories?.length) return null

  return (
    <div className='mb-1 border shadow p-0 m-0 mb-2 rounded cus-container'>
      <h5 className='border-bottom pb-2 m-3 fs-3 fw-normal text-blue'>
        Truyện đã đăng ({stories.length})
      </h5>
      <div className='row mx-0'>
        {stories.map((book) => (
          <StoryCard key={book.id} story={book} />
        ))}
      </div>
    </div>
  )
}

export default StoriesPosted
