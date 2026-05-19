import StoryCard from '../components/StoryCard'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'

const Info = () => {
  return (
    <>
      <h2 className='page-title'>
        {import.meta.env.VITE_APP_NAME} - Truyện online {'>'}
      </h2>
    </>
  )
}

export default Info
