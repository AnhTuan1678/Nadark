import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { bookshelfAPI } from '../services/api'
import StoryCard from '../components/StoryCard'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'
import { useSnackbar } from '../context/SnackbarContext'

const Bookshelf = () => {
  const [stories, setStories] = useState(null)
  const [total, setTotal] = useState(0)
  const limit = 30
  const [page, setPage] = useState(1)

  const token = useSelector((state) => state.user.token)
  const showSnackbar = useSnackbar()

  useEffect(() => {
    const fetchStories = async (currentPage) => {
      if (!token) return
      try {
        const offset = (currentPage - 1) * limit
        const res = await bookshelfAPI.getBookshelf(token, { limit, offset })
        if (res.data) {
          setStories(res.data)
          setTotal(res.total || 0)
        }
      } catch (err) {
        showSnackbar({
          status: 'error',
          message: err.message || 'Lỗi không xác định',
        })
      }
    }
    fetchStories(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page, showSnackbar, token])

  const totalPages = Math.ceil(total / limit) || 1

  if (!token) return <EmptyState message='Bạn chưa đăng nhập' />
  if (!stories) return <Loading />
  if (stories.length === 0) return <EmptyState message='Danh sách trống' />

  return (
    <>
      <h2 className='page-title'>Truyện đã lưu</h2>

      <div className='row ps-1 pe-1 flex-grow-1'>
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onChangePage={setPage} />
    </>
  )
}

export default Bookshelf
