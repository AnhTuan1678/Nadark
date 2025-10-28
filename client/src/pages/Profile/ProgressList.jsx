import StoryCard from '../../components/StoryCard'
import { useNavigate } from 'react-router-dom'

const ProgressList = ({ progress }) => {
  const navigate = useNavigate()

  if (!progress?.length) return null

  return (
    <div className='container cus-container shadow flex-grow-1 d-flex flex-column mb-2'>
      <h2 className='page-title'>Truyện đã đọc ({progress.length})</h2>
      <div className='row mx-0'>
        {progress.map((process) => (
          <StoryCard
            key={process.id}
            story={process.Book}
            className='col-4 col-md-3 col-lg-2 p-0'
          />
        ))}
      </div>
      <div className='text-center'>
        <button
          className='btn btn-outline-primary mb-3'
          onClick={() => navigate('/recently')}>
          Xem tất cả
        </button>
      </div>
    </div>
  )
}

export default ProgressList
