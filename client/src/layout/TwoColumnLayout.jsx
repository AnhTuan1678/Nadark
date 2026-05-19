import { useEffect, useState } from 'react'
import NotifyBlock from '../components/NotifyBlock'
import { bookAPI } from '../services/api'
import TopBooksTabs from './TopBookTabs'
import cover from '../assets/image/cover.jpg'

const TwoColumnLayout = ({ children }) => {
  const [topBooksData, setTopBooksData] = useState([])
  useEffect(() => {
    const loadTop = async () => {
      try {
        const res = await bookAPI.getTopStoriesStats(10)
        setTopBooksData(res)
      } catch (err) {
        console.error('Lỗi khi lấy top truyện:', err)
      }
    }
    loadTop()
  }, [])

  return (
    <div className='container cus-container shadow flex-grow-1 d-flex flex-column'>
      <NotifyBlock>
        <strong>Lưu ý:</strong> Một số ảnh trên trang web có thể không hiển thị do đã bị xóa bởi tác giả hoặc vấn đề bản quyền.
      </NotifyBlock>
      <div className='row flex-grow-1'>
        <div className='col col-12 col-md-8 d-flex flex-column'>{children}</div>
        <div className='col col-12 col-md-4 m-0 p-1'>
          <TopBooksTabs data={topBooksData} />
          <RecentReadBooks />
        </div>
      </div>
    </div>
  )
}

import { Tab, Tabs } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import styles from './TopBooksTabs.module.css'
import EmptyState from '../components/EmptyState'
import ImageWithFallback from '../components/ImageWithFallback'
import { timeAgo } from '../utils/timeAgo'

const RecentReadBooks = () => {
  const [books, setBooks] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const recentBooks = Object.keys(localStorage)
      .filter((key) => key.startsWith('chapter_'))
      .map((key) => {
        try {
          return JSON.parse(localStorage.getItem(key))
        } catch {
          return null
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.date - a.date)
      .slice(0, 5)

    setBooks(recentBooks)
  }, [])

  const renderList = () => {
    if (books.length === 0) {
      return <EmptyState message='Chưa có lịch sử đọc' />
    }

    return (
      <div>
        {books.map((book, index) => (
          <div
            key={book.id || index}
            className={`d-flex align-items-center px-2 py-1 m-0 cursor-pointer ${styles.bookRow}`}
            onClick={() => navigate(`/story/${book.book_id}/chapter/${book.index}`)}>
            {/* STT */}
            <div className='p-0 pe-2 fw-bold text-secondary'>
              {String(index + 1).padStart(2, '0')}
            </div>

            {/* Ảnh */}
            <ImageWithFallback
              urlAvatar={book.book.urlAvatar}
              defaultUrl={cover}
              className={styles.avatar}
            />

            {/* Info */}
            <div className='flex-grow-1 ms-2'>
              <p className={`fs-7 fw-bold m-0 ${styles.title}`}>{book.book.title}</p>

              <div className='d-flex'>
                <p className={`fs-7 flex-grow-1 m-0 ${styles.chapter}`}>
                  Chương {book.index + ': ' + book.title}
                </p>

                <div className={styles.views}>
                  {timeAgo(book.date)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`${styles.wrapper} p-0 mt-1`}>
      <Tabs
        activeKey='recent'
        className={styles.tabs}
        justify
        variant='pills'>
        <Tab
          eventKey='recent'
          title='Đọc gần đây (lưu trên máy)'
          tabClassName={styles.tabButton}>
          {renderList()}
        </Tab>
      </Tabs>
    </div>
  )
}

export default TwoColumnLayout
