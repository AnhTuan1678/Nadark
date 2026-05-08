import React, { useState, useEffect } from 'react'
import { chapterAPI } from '../../services/api'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { clearCacheKey } from '../../services/cacheFetch'
import { API_URL } from '../../services/api/config'
import 'bootstrap/dist/css/bootstrap.min.css'
import './AddChapter.css'

const EditChapter = () => {
  const { chapterId } = useParams()
  const navigate = useNavigate()
  const token = useSelector((state) => state.user.token)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    author_note: '',
    content: '',
    word_count: 0,
  })

  // load chapter
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true)

        const data = await chapterAPI.getChapter(chapterId)

        setFormData({
          title: data.title || '',
          author_note: data.author_note || '',
          content: data.content || '',
          word_count: data.word_count || 0,
        })
      } catch (err) {
        console.error(err)
        setError('Không tải được chapter')
      } finally {
        setLoading(false)
      }
    }

    if (chapterId) {
      fetchChapter()
    }
  }, [chapterId])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'content') {
      const wordCount =
        value.trim() === '' ? 0 : value.trim().split(/\s+/).length

      setFormData((prev) => ({
        ...prev,
        content: value,
        word_count: wordCount,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setSuccess('')
      setError('')

      const response = await chapterAPI.updateChapter(
        chapterId,
        {
          title: formData.title,
          author_note: formData.author_note,
          content: formData.content,
        },
        token,
      )

      setSuccess('Cập nhật chapter thành công')

      // clear cache
      await clearCacheKey(`${API_URL}/api/chapter/${chapterId}`)

      setTimeout(() => {
        navigate(-1)
      }, 1000)

      console.log(response)
    } catch (err) {
      console.error(err)

      setError(err.message || 'Có lỗi khi cập nhật chapter')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container cus-container border mt-5'>
      <h3 className='mb-4 text-center text-primary'>Chỉnh sửa chương</h3>

      {success && <div className='alert alert-success'>{success}</div>}

      {error && <div className='alert alert-danger'>{error}</div>}

      {loading && !formData.title ? (
        <div className='text-center'>Đang tải dữ liệu...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label className='form-label fw-semibold'>Tiêu đề chương *</label>

            <input
              type='text'
              className='form-control'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='Nhập tiêu đề chương'
              required
            />
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Ghi chú tác giả</label>

            <textarea
              className='form-control'
              name='author_note'
              rows='3'
              value={formData.author_note}
              onChange={handleChange}
              placeholder='Nhập ghi chú tác giả'
            />
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Nội dung chương *</label>

            <textarea
              className='form-control'
              name='content'
              rows='12'
              value={formData.content}
              onChange={handleChange}
              placeholder='Nhập nội dung chương'
              required
            />

            <small className='text-muted'>Số từ: {formData.word_count}</small>
          </div>

          <div className='d-flex justify-content-center mb-4'>
            <button
              type='submit'
              className='btn btn-success me-3 px-4'
              disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>

            <button
              type='button'
              className='btn btn-outline-secondary px-4'
              onClick={() => navigate(-1)}>
              Quay lại
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default EditChapter
