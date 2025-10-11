import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGenres } from '../redux/genreSlice'
import { bookAPI } from '../services/api'
import { useParams } from 'react-router-dom'
import './AddStory.css'
import GenreSelector from '../components/GenreSelector'
import { clearCacheKey } from '../services/cacheFetch'
import { API_URL } from '../services/api/config'

const EditStory = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { list: genresData } = useSelector((state) => state.genre)
  const user = useSelector((state) => state.user)

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genres: [],
    summary: '',
    status: 'Đang tiến hành',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Lấy danh sách thể loại
  useEffect(() => {
    if (!genresData.length) dispatch(fetchGenres())
  }, [dispatch, genresData.length])

  // Load thông tin sách hiện tại
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        console.log(id)
        const data = await bookAPI.getStoryDetails(id)
        // Chuyển name -> id dựa vào genresData
        const genreIds = data.genres
          ? data.genres
              .map((g) => {
                const found = genresData.find((x) => x.name === g)
                return found ? found.id : null
              })
              .filter(Boolean)
          : []
        console.log(genreIds)
        setFormData({
          title: data.title || '',
          author: data.author || '',
          genres: genreIds,
          summary: data.description || '',
          status: data.status || 'Đang tiến hành',
        })
      } catch (err) {
        setError('Không tải được thông tin truyện.')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBook()
  }, [genresData, id])

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Gửi form cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')

    try {
      const payload = {
        title: formData.title,
        author: formData.author,
        description: formData.summary,
        genres: formData.genres,
        status: formData.status,
      }
      const updatedBook = await bookAPI.updateBook(id, payload, user.token)
      setSuccess(`Đã cập nhật truyện: ${updatedBook.title}`)
      await clearCacheKey(`${API_URL}/api/book/${id}`)
    } catch (err) {
      setError(err.message || 'Có lỗi khi cập nhật truyện.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container border cus-container shadow-sm p-4 flex-grow-1'>
      <h3 className='mb-4 text-center text-primary'>Chỉnh sửa truyện</h3>

      {success && <div className='alert alert-success'>{success}</div>}
      {error && <div className='alert alert-danger'>{error}</div>}

      {loading && !formData.title ? (
        <div className='text-center'>Đang tải dữ liệu...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='row g-3'>
            {/* Tiêu đề */}
            <div className='col-12 col-md-6'>
              <label className='form-label fw-semibold'>Tiêu đề *</label>
              <input
                type='text'
                className='form-control'
                name='title'
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tác giả */}
            <div className='col-12 col-md-6'>
              <label className='form-label fw-semibold'>Tác giả *</label>
              <input
                type='text'
                className='form-control'
                name='author'
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tình trạng */}
            <div className='col-12 col-md-6'>
              <label className='form-label fw-semibold'>Tình trạng *</label>
              <select
                className='form-select'
                name='status'
                value={formData.status}
                onChange={handleChange}>
                <option>Đang tiến hành</option>
                <option>Hoàn thành</option>
                <option>Tạm ngưng</option>
              </select>
            </div>

            {/* Thể loại */}
            <div className='col-12'>
              <GenreSelector
                selectedGenres={formData.genres}
                onChange={(ids) =>
                  setFormData((prev) => ({ ...prev, genres: ids }))
                }
                classNameTitle='form-label fw-semibold mb-0'
              />
            </div>

            {/* Tóm tắt */}
            <div className='col-12'>
              <label className='form-label fw-semibold'>Tóm tắt *</label>
              <textarea
                className='form-control'
                name='summary'
                value={formData.summary}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            {/* Submit */}
            <div className='col-12 d-flex justify-content-center mt-3'>
              <button
                type='submit'
                className='btn btn-success px-4'
                disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default EditStory
