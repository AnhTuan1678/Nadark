import { useEffect, useState } from 'react'
import { bookAPI } from '../services/api'
import StoryCard from '../components/StoryCard'
import Loading from '../components/Loading'

const Hot = () => {
  const [newUpdated, setNewUpdated] = useState([])
  const [newCreated, setNewCreated] = useState([])
  const [mostFollowed, setMostFollowed] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotBooks = async () => {
      setLoading(true)
      try {
        const [updatedRes, createdRes, followRes] = await Promise.all([
          bookAPI.getNewlyUpdatedBooks(12),
          bookAPI.getNewlyCreatedBooks(12),
          bookAPI.getMostFollowedBooks(12),
        ])

        setNewUpdated(updatedRes.data || [])
        setNewCreated(createdRes.data || [])
        setMostFollowed(followRes.data || [])
      } catch (err) {
        console.error('Lỗi khi tải sách Hot:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHotBooks()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='hot-page'>
      {/* Sách mới cập nhật */}
      {newUpdated.length > 0 && (
        <section className='hot-section'>
          <h2 className='page-title'>
            {import.meta.env.VITE_APP_NAME} - Truyện mới cập nhật
          </h2>
          <div className='row ps-1 pe-1'>
            {newUpdated.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                className='col-4 col-md-3 col-lg-2 p-0'
              />
            ))}
          </div>
        </section>
      )}

      {/* Sách mới tạo */}
      {newCreated.length > 0 && (
        <section className='hot-section'>
          <h2 className='page-title'>
            {import.meta.env.VITE_APP_NAME} - Truyện mới được thêm
          </h2>
          <div className='row ps-1 pe-1'>
            {newCreated.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                className='col-4 col-md-3 col-lg-2 p-0'
              />
            ))}
          </div>
        </section>
      )}

      {/* Sách nhiều follow */}
      {mostFollowed.length > 0 && (
        <section className='hot-section'>
          <h2 className='page-title'>
            {import.meta.env.VITE_APP_NAME} - Theo dõi nhiều nhất
          </h2>
          <div className='row ps-1 pe-1'>
            {mostFollowed.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                className='col-4 col-md-3 col-lg-2 p-0'
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Hot
