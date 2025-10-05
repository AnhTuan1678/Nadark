import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { progressAPI } from '../services/api' // import hàm mới
import StoryCard from '../components/StoryCard'
import NotifyBlock from '../components/NotifyBlock'
import { formatterStoryDetail } from '../utils/formatter'

const History = () => {
  const [stories, setStories] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 30

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

  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className='container cus-container shadow flex-grow-1'>
      <NotifyBlock>
        <strong>NaDark</strong> đang trong quá trình phát triển. Xin lỗi vì trải
        nghiệm không thoải mái này!
      </NotifyBlock>

      <h2 className='m-3 fs-3 fw-normal text-blue'>
        {import.meta.env.VITE_APP_NAME} - Truyện đã đọc {'>'}
      </h2>

      {stories?.length === 0 ? (
        <p>Chưa đọc truyện nào</p>
      ) : (
        <>
          <div className='row mx-0'>
            {stories.map((book) => (
              <StoryCard
                key={book.id}
                story={formatterStoryDetail(book.Book)}
              />
            ))}
          </div>
        </>
      )}

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

export default History
