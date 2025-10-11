import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './ChapterForm.module.css'

const ChapterForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    index: '',
    title: '',
    author_note: '',
    content: '',
    word_count: 0,
  })

  // Nếu có dữ liệu ban đầu thì nạp vào form
  useEffect(() => {
    if (initialData) {
      const wordCount =
        initialData.content?.trim() === ''
          ? 0
          : initialData.content?.trim().split(/\s+/).length
      setFormData({
        ...initialData,
        word_count: wordCount || 0,
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'content') {
      const wordCount =
        value.trim() === '' ? 0 : value.trim().split(/\s+/).length
      setFormData({ ...formData, content: value, word_count: wordCount })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (typeof onSubmit === 'function') onSubmit(formData)
  }

  return (
    <div className={`container mt-4 ${styles.wrapper}`}>
      <div className={`card shadow-sm p-4 ${styles.card}`}>
        <h4 className={`mb-4 text-center text-primary ${styles.title}`}>
          {initialData?.id ? 'Chỉnh sửa chương' : 'Thêm chương mới'}
        </h4>

        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label className='form-label fw-semibold'>Số chương *</label>
            <input
              type='number'
              name='index'
              value={formData.index}
              onChange={handleChange}
              className='form-control'
              placeholder='Nhập số thứ tự chương'
              required
            />
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Tiêu đề *</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              className='form-control'
              placeholder='Nhập tiêu đề chương'
              required
            />
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Ghi chú tác giả</label>
            <textarea
              name='author_note'
              rows='3'
              value={formData.author_note}
              onChange={handleChange}
              className='form-control'
              placeholder='Nhập ghi chú tác giả (nếu có)'></textarea>
          </div>

          <div className='mb-3'>
            <label className='form-label fw-semibold'>Nội dung *</label>
            <textarea
              name='content'
              rows='8'
              value={formData.content}
              onChange={handleChange}
              className={`form-control ${styles.contentBox}`}
              placeholder='Nhập nội dung chương'
              required></textarea>
            <small className='text-muted'>Số từ: {formData.word_count}</small>
          </div>

          <div className='d-flex justify-content-center mt-4'>
            <button
              type='submit'
              className={`btn btn-primary me-3 px-4 ${styles.btnSubmit}`}>
              {initialData?.id ? 'Cập nhật' : 'Thêm chương'}
            </button>

            {onCancel && (
              <button
                type='button'
                className={`btn btn-outline-secondary px-4 ${styles.btnCancel}`}
                onClick={onCancel}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChapterForm
