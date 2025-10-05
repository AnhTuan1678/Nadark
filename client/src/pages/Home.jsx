import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { bookAPI } from '../services/api'
import StoryCard from '../components/StoryCard'
import NotifyBlock from '../components/NotifyBlock'

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
        setTotal(res.total || 30)
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

  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className='container cus-container shadow flex-grow-1'>
      <NotifyBlock>
        <strong>NaDark</strong> đang trong quá trình phát triển. Xin lỗi vì trải
        nghiệm không thoải mái này!
      </NotifyBlock>

      <h2 className='m-3 fs-3 fw-normal text-blue'>
        {import.meta.env.VITE_APP_NAME} - Truyện online {'>'}
      </h2>

      <div className='row ps-4 pe-4'>
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {/* Pagination */}
      <div className='d-flex justify-content-center my-4'>
        <nav>
          <ul className='pagination'>
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className='page-link' onClick={() => setPage(page - 1)}>
                &laquo;
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
              .map((p) => (
                <li
                  key={p}
                  className={`page-item ${p === page ? 'active' : ''}`}>
                  <button className='page-link' onClick={() => setPage(p)}>
                    {p}
                  </button>
                </li>
              ))}

            <li
              className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className='page-link' onClick={() => setPage(page + 1)}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Home
