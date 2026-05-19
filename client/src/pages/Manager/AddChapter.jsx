import React, { useState } from 'react'
import { chapterAPI, mediaAPI } from '../../services/api'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { clearCacheKey } from '../../services/cacheFetch'
import { API_URL } from '../../services/api/config'

import TextBlock from '../../components/Block/TextBlock'
import ImageBlock from '../../components/Block/ImageBlock'

const AddChapter = () => {
  const { id: bookId } = useParams()
  const navigate = useNavigate()
  const token = useSelector((state) => state.user.token)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    author_note: '',
    blocks: [{ type: 'text', content: '' }],
  })

  /* ===================== ADD BLOCK ===================== */
  const addBlock = (type) => {
    setFormData((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        type === 'text'
          ? { type: 'text', content: '' }
          : { type: 'image', mode: 'url', url: '', file: null },
      ],
    }))
  }

  /* ===================== UPDATE BLOCK ===================== */
  const updateBlock = (index, value) => {
    setFormData((prev) => {
      const newBlocks = [...prev.blocks]
      newBlocks[index] = { ...newBlocks[index], ...value }

      return {
        ...prev,
        blocks: newBlocks,
      }
    })
  }

  /* ===================== DELETE BLOCK ===================== */
  const deleteBlock = (index) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }))
  }

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      let content = ''

      for (const block of formData.blocks) {
        /* TEXT */
        if (block.type === 'text') {
          content += (block.content || '') + '\n'
        }

        /* IMAGE */
        if (block.type === 'image') {
          let url = block.url

          if (block.mode === 'file' && block.file) {
            const res = await mediaAPI.uploadMedia(token, block.file)
            url = res.url
          }

          if (url) {
            content += `[!img](${url})\n`
          }
        }
      }

      const wordCount = formData.blocks
        .filter((b) => b.type === 'text')
        .reduce((a, b) => a + (b.content?.trim().split(/\s+/).length || 0), 0)

      await chapterAPI.createChapter(
        {
          title: formData.title,
          author_note: formData.author_note,
          content,
          word_count: wordCount,
          book_id: bookId,
        },
        token,
      )

      await clearCacheKey(`${API_URL}/api/book/${bookId}/chapters`)
      await clearCacheKey(`${API_URL}/api/book/newly-updated?limit=12&offset=0`)

      navigate(-1)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Có lỗi khi tạo chapter')
    } finally {
      setLoading(false)
    }
  }

  /* ===================== UI ===================== */
  return (
    <div className='container border cus-container shadow-sm p-4 flex-grow-1'>
      <h3 className='mb-4 text-center text-primary'>Thêm chương</h3>

      {error && <div className='alert alert-danger'>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className='row g-3'>
          {/* TITLE */}
          <div className='col-12'>
            <label className='form-label fw-semibold'>Tiêu đề chương *</label>
            <input
              type='text'
              className='form-control'
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* AUTHOR NOTE */}
          <div className='col-12'>
            <label className='form-label fw-semibold'>Ghi chú tác giả</label>
            <textarea
              className='form-control'
              rows={5}
              value={formData.author_note}
              onChange={(e) =>
                setFormData({ ...formData, author_note: e.target.value })
              }
            />
          </div>

          {/* BLOCK EDITOR */}
          <div className='col-12'>
            <label className='form-label fw-semibold'>Nội dung chương</label>
            {formData.blocks.map((block, index) => (
              <div key={index}>
                {block.type === 'text' && (
                  <TextBlock
                    block={block}
                    index={index}
                    updateBlock={updateBlock}
                    deleteBlock={deleteBlock}
                  />
                )}

                {block.type === 'image' && (
                  <ImageBlock
                    block={block}
                    index={index}
                    updateBlock={updateBlock}
                    deleteBlock={deleteBlock}
                  />
                )}
              </div>
            ))}

            {/* ADD BLOCK */}
            <div className='d-flex gap-2 my-3'>
              <button
                type='button'
                className='btn btn-outline-primary'
                onClick={() => addBlock('text')}>
                + Text
              </button>

              <button
                type='button'
                className='btn btn-outline-success'
                onClick={() => addBlock('image')}>
                + Image
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <div className='col-12 d-flex justify-content-center mt-3'>
            <button
              type='submit'
              className='btn btn-primary px-4'
              disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu chương'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddChapter
