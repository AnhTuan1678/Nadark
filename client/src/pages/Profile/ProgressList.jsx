import StoryCard from '../../components/StoryCard'
import { useNavigate } from 'react-router-dom'

const ProgressList = ({ progress }) => {
  const navigate = useNavigate()

  if (!progress?.length) return null

  return (
    <div className='mb-3 border shadow p-0 m-0 rounded cus-container'>
      <h5 className='border-bottom pb-2 m-3 fs-3 fw-normal text-blue'>
        Truyện đã đọc ({progress.length})
      </h5>
      <div className='row mx-0'>
        {progress.map((process) => (
          <StoryCard
            key={process.id}
            story={process.Book}
          />
        ))}
      </div>
      <div className='text-center'>
        <button
          className='btn btn-outline-primary mb-3'
          onClick={() => navigate('/history')}>
          Xem tất cả
        </button>
      </div>
    </div>
  )
}

export default ProgressList
