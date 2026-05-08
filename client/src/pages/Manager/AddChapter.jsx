import React, { useState } from 'react'
import { chapterAPI } from '../../services/api'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { clearCacheKey } from '../../services/cacheFetch'
import { API_URL } from '../../services/api/config'
import 'bootstrap/dist/css/bootstrap.min.css'
import './AddChapter.css'

const AddChapter = () => {
  const { id: bookId } = useParams()
  const navigate = useNavigate()
  const token = useSelector((state) => state.user.token)

  const [formData, setFormData] = useState({
    title: '',
    author_note: '',
    content: '',
    word_count: 0,
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    // Nếu là content thì tính số từ
    if (name === 'content') {
      const wordCount =
        value.trim() === '' ? 0 : value.trim().split(/\s+/).length
      setFormData({ ...formData, content: value, word_count: wordCount })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    // Gửi dữ liệu lên server tại đây
    try {
      const response = await chapterAPI.createChapter(
        {
          ...formData,
          book_id: bookId,
        },
        token,
      )
      console.log('Chapter created:', response)
      // Clear cache for the book
      await clearCacheKey(`${API_URL}/api/book/${bookId}/chapters`)
      setTimeout(() => {
        navigate(-1)
      }, 1000)
    } catch (err) {
      console.error('Error creating chapter:', err)
    }
  }

  return (
    <div className='container cus-container border mt-5'>
      <h3 className='mb-4 text-center text-primary'>Thêm chương mới</h3>
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
            placeholder='Nhập ghi chú tác giả'></textarea>
        </div>

        <div className='mb-3'>
          <label className='form-label fw-semibold'>Nội dung chương *</label>
          <textarea
            className='form-control'
            name='content'
            rows='8'
            value={formData.content}
            onChange={handleChange}
            placeholder='Nhập nội dung chương'
            required></textarea>
          <small className='text-muted'>Số từ: {formData.word_count}</small>
        </div>

        <div className='d-flex justify-content-center mb-4'>
          <button type='submit' className='btn btn-primary me-3 px-4'>
            Thêm chương
          </button>
          <button
            type='button'
            className='btn btn-outline-secondary px-4'
            onClick={() => {
              navigate(-1)
            }}>
            Quay lại
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddChapter
