import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGenres } from '../redux/genreSlice'
import { bookAPI } from '../services/api'
import './AddStory.css'
import GenreSelector from '../components/GenreSelector'

const AddStory = () => {
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

  const dispatch = useDispatch()
  const { list: genresData } = useSelector((state) => state.genre)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (!genresData.length) dispatch(fetchGenres())
  }, [dispatch, genresData.length])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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
      const newBook = await bookAPI.createBook(payload, user.token)
      setSuccess(`Tạo truyện thành công: ${newBook.title}`)
      setFormData({
        title: '',
        author: '',
        genres: [],
        summary: '',
        status: 'Đang tiến hành',
      })
      console.log(newBook)
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container border cus-container shadow-sm p-4'>
      <h3 className='mb-4 text-center text-primary'>Thêm truyện mới</h3>

      {success && <div className='alert alert-success'>{success}</div>}
      {error && <div className='alert alert-danger'>{error}</div>}

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
              placeholder='Nhập tiêu đề truyện'
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
              placeholder='Nhập tên tác giả'
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
              onChange={(allIds) =>
                setFormData((prev) => ({ ...prev, genres: allIds }))
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
              placeholder='Nhập tóm tắt truyện'
              required
            />
          </div>

          {/* Submit */}
          <div className='col-12 d-flex justify-content-center mt-3'>
            <button
              type='submit'
              className='btn btn-primary px-4'
              disabled={loading}>
              {loading ? 'Đang gửi...' : 'Thêm truyện'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddStory
