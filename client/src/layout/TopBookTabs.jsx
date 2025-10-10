import { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import styles from './TopBooksTabs.module.css'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ImageWithFallback from '../components/ImageWithFallback'

const TopBooksTabs = ({ data }) => {
  const [key, setKey] = useState('month')
  const navigate = useNavigate()

  const getRankColor = (index) => {
    if (index === 0) return '#ff6600'
    if (index === 1) return '#00ccff'
    if (index === 2) return '#cc0000'
    return '#aaa'
  }

  const renderList = (books) => {
    if (!books) return <EmptyState message='Đang lấy dữ liệu' />
    if (books.length === 0);
    ;<EmptyState message='Không có dữ lieejuF' />
    return (
      <div className=''>
        {books.map((book, index) => (
          <div
            key={book.id || index}
            className={`d-flex align-items-center px-2 py-1 m-0 cursor-pointer ${styles.bookRow}`}
            onClick={() => navigate(`/story/${book.id}`)}>
            {/* Số thứ tự */}
            <div
              className='p-0 pe-2 fw-bold'
              style={{ color: getRankColor(index) }}>
              {String(index + 1).padStart(2, '0')}
            </div>

            {/* Ảnh */}
            <ImageWithFallback
              urlAvatar={book.urlAvatar}
              className={`${styles.avatar}`}
            />

            {/* Thông tin */}
            <div className='flex-grow-1 ms-2'>
              <div className={styles.title}>{book.title}</div>
              <div className='d-flex'>
                <div className={`fs-8 flex-grow-1 ${styles.chapter}`}>
                  Chapter {book.chapterCount}
                </div>
                <div className={styles.views}>
                  <FontAwesomeIcon icon={faEye} />
                  {book[`${key}Views`]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`${styles.wrapper} p-0`}>
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className={styles.tabs}
        justify
        variant='pills'>
        <Tab eventKey='month' title='Top Tháng' tabClassName={styles.tabButton}>
          {renderList(data.month)}
        </Tab>
        <Tab eventKey='week' title='Top Tuần' tabClassName={styles.tabButton}>
          {renderList(data.week)}
        </Tab>
        <Tab eventKey='today' title='Top Ngày' tabClassName={styles.tabButton}>
          {renderList(data.today)}
        </Tab>
      </Tabs>
    </div>
  )
}

export default TopBooksTabs
