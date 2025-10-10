import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { progressAPI } from '../services/api'
import StoryCard from '../components/StoryCard'
import { formatterStoryDetail } from '../utils/formatter'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'

const RecentlyRead = () => {
  const [stories, setStories] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 36

  const user = useSelector((state) => state.user)

  useEffect(() => {
    const fetchHistoryStories = async (currentPage) => {
      if (!user.token) return
      try {
        const offset = (currentPage - 1) * limit
        const res = await progressAPI.getMyProgress(user.token, {
          limit,
          offset,
        })

        if (res && Array.isArray(res.data)) {
          setStories(res.data)
          setTotal(res.total || res.data.length)
        } else {
          setStories([])
          setTotal(0)
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (err) {
        console.error('Lỗi khi tải tiến trình truyện:', err)
      }
    }

    fetchHistoryStories(page)
  }, [page, user.token])

  if (!user.isLoggedIn) return <EmptyState message='Bạn chưa đăng nhập' />
  if (!stories) return <Loading />
  if (stories.length === 0) <EmptyState message='Danh sách trống' />
  return (
    <>
      <h2 className='page-title'>
        {import.meta.env.VITE_APP_NAME} - Truyện đã đọc {'>'}
      </h2>

      <div className='row ps-1 pe-1'>
        {stories.map((book) => (
          <StoryCard key={book.id} story={formatterStoryDetail(book.Book)} />
        ))}
      </div>
      <div className='flex-grow-1'></div>
      <Pagination
        page={page}
        totalPages={Math.ceil(total / limit) || 1}
        onChangePage={(p) => setPage(p)}
      />
    </>
  )
}

export default RecentlyRead
