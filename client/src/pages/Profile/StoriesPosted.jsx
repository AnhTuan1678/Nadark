import EmptyState from '../../components/EmptyState'
import StoryCard from '../../components/StoryCard'

const StoriesPosted = ({ stories }) => {
  if (!stories?.length) return null

  return (
    <div className='container cus-container shadow flex-grow-1 d-flex flex-column mb-2'>
      <h2 className='page-title'>Truyện đã đăng ({stories.length})</h2>
      <div className='row mx-0'>
        {stories.map((book) => (
          <StoryCard
            key={book.id}
            story={book}
            className='col-4 col-md-3 col-lg-2 p-0'
          />
        ))}
      </div>
    </div>
  )
}

export default StoriesPosted
