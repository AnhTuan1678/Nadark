import { useState } from 'react'
import { useSelector } from 'react-redux'
import { bookAPI, userAPI, chapterAPI } from '../../services/api'
import { useEffect } from 'react'
import StoryCard from '../../components/StoryCard'
import EmptyState from '../../components/EmptyState'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import styles from './Styles.module.css'
import ChapterTable from './ChapterTable'
import ChapterForm from './ ChapterForm'
import { useNavigate } from 'react-router-dom'
import { clearCacheKey } from '../../services/cacheFetch'
import { API_URL } from '../../services/api/config'

const Manager = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  const [booksUploaded, setBooksUploaded] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [chapters, setChapters] = useState([])

  const handleDeleteChapter = async (chapterId) => {
    if (!selectedBook || !chapterId) return
    try {
      await chapterAPI.deleteChapter(chapterId, user.token)
      // Refetch chapters after deletion
      clearCacheKey(`${API_URL}/api/book/${selectedBook}/chapters`)
      const data = await bookAPI.getChapters(selectedBook)
      setChapters(data)
    } catch (err) {
      console.error('Lỗi xóa chương:', err)
    }
  }

  useEffect(() => {
    const uid = user.id
    if (!uid) return
    const fetchData = async () => {
      try {
        const books = await userAPI.getUserBooks(uid)

        setBooksUploaded(books.data)
      } catch (err) {
        console.error('Lỗi fetch profile/progress:', err)
      }
    }
    fetchData()
  }, [user.id])

  useEffect(() => {
    if (!selectedBook) return
    const fetchChapters = async () => {
      const data = await bookAPI.getChapters(selectedBook)
      setChapters(data)
    }
    fetchChapters()
  }, [selectedBook])

  if (!booksUploaded?.length) return <EmptyState message='Không có thông tin' />

  return (
    <div className='container cus-container flex-grow-1 p-2'>
      <h3 className='border-bottom'>Series of @{user.username}</h3>
      <div className='row flex-grow-1'>
        <div className='m-0 px-2 row'>
          <div className='p-0 m-0 col col-2'>
            {booksUploaded.map((book, index) => (
              <div
                className={`position-relative p-2 rounded ${
                  book.id === selectedBook && styles.active
                }`}
                key={index}>
                <StoryCard
                  key={book.id}
                  story={book}
                  className=''
                  clickable={false}
                />
                <div
                  className={`position-absolute top-0 start-0 bottom-0 w-100 h-100 cursor-pointer d-flex flex-column ${styles.overlay}`}
                  style={{ zIndex: 1000 }}
                  onClick={() => {
                    clearCacheKey(`${API_URL}/api/book/${book.id}/chapters`)
                    setSelectedBook(book.id)
                  }}>
                  <button
                    className={`btn ${styles.btn} ${styles.btnEdit}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/action/${book.id}/edit`)
                    }}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className={`btn ${styles.btn} ${styles.btnDelete}`}
                    onClick={(e) => {
                      e.stopPropagation()
                    }}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className={`btn ${styles.btn} ${styles.btnAdd}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/action/${book.id}/addChapter`)
                    }}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className='col col-10' style={{ maxHeight: '80vh' }}>
            <ChapterTable chapters={chapters} onDelete={handleDeleteChapter} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Manager
