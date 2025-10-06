import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { bookAPI } from '../services/api'
import StoryCard from '../components/StoryCard'
import Pagination from '../components/Pagination'

const Home = () => {
  const [stories, setStories] = useState([])
  const [total, setTotal] = useState(0)
  const limit = 36

  const [searchParams, setSearchParams] = useSearchParams()
  const pageParam = parseInt(searchParams.get('page')) || 1
  const [page, setPage] = useState(pageParam)

  const fetchStories = async (currentPage) => {
    try {
      const offset = (currentPage - 1) * limit
      const res = await bookAPI.getAllStory({ limit, offset })
      if (res.data) {
        setStories(res.data)
        setTotal(res.total || limit)
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách truyện:', err)
    }
  }

  // Khi page thay đổi, cập nhật URL và fetch API
  useEffect(() => {
    setSearchParams({ page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchStories(page)
  }, [page, setSearchParams])

  return (
    <>
      <h2 className='m-3 fs-3 fw-normal text-blue'>
        {import.meta.env.VITE_APP_NAME} - Truyện online {'>'}
      </h2>
      <div className='row ps-4 pe-4'>
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={Math.ceil(total / limit) || 1}
        onChangePage={(p) => setPage(p)}
      />
    </>
  )
}

export default Home
