import React, { useState, useEffect } from 'react'
import { chapterAPI, mediaAPI } from '../../services/api'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { clearCacheKey } from '../../services/cacheFetch'
import { API_URL } from '../../services/api/config'
import TextBlock from '../../components/Block/TextBlock'
import ImageBlock from '../../components/Block/ImageBlock'

const parseContentToBlocks = (content = '') => {
  const lines = content.split('\n')
  const blocks = []

  lines.forEach((line) => {
    const imgMatch = line.match(/^\[!img\]\((.+)\)$/)
    if (imgMatch) {
      blocks.push({ type: 'image', mode: 'url', url: imgMatch[1], file: null })
    } else if (line.trim() !== '') {
      blocks.push({ type: 'text', content: line })
    }
  })

  return blocks.length ? blocks : [{ type: 'text', content: '' }]
}

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
    blocks: [{ type: 'text', content: '' }],
  })

  /* ================= LOAD CHAPTER ================= */
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true)

        const data = await chapterAPI.getChapter(chapterId)

        setFormData({
          title: data.title || '',
          author_note: data.author_note || '',
          blocks: parseContentToBlocks(data.content || ''),
        })
      } catch (err) {
        console.error(err)
        setError('Không tải được chapter')
      } finally {
        setLoading(false)
      }
    }

    if (chapterId) fetchChapter()
  }, [chapterId])

  /* ================= BLOCK FUNCTIONS ================= */
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

  const updateBlock = (index, value) => {
    const newBlocks = [...formData.blocks]
    newBlocks[index] = { ...newBlocks[index], ...value }

    setFormData((prev) => ({
      ...prev,
      blocks: newBlocks,
    }))
  }

  const deleteBlock = (index) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }))
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setSuccess('')
      setError('')

      let content = ''
      let wordCount = 0

      for (const block of formData.blocks) {
        if (block.type === 'text') {
          const text = block.content || ''
          content += text + '\n'
          wordCount += text.trim() ? text.trim().split(/\s+/).length : 0
        }

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

      await chapterAPI.updateChapter(
        chapterId,
        {
          title: formData.title,
          author_note: formData.author_note,
          content,
          word_count: wordCount,
        },
        token,
      )

      await clearCacheKey(`${API_URL}/api/chapter/${chapterId}`)
      setSuccess('Cập nhật chapter thành công')
      setTimeout(() => navigate(-1), 800)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Có lỗi khi cập nhật chapter')
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */
  return (
    <div className='container border cus-container shadow-sm p-4 flex-grow-1'>
      <h3 className='mb-4 text-center text-primary'>Chỉnh sửa chương</h3>

      {success && <div className='alert alert-success'>{success}</div>}
      {error && <div className='alert alert-danger'>{error}</div>}

      {loading && !formData.title ? (
        <div className='text-center'>Đang tải dữ liệu...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className='mb-3'>
            <label className='form-label fw-semibold'>Tiêu đề *</label>
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
          <div className='mb-3'>
            <label className='form-label fw-semibold'>Ghi chú tác giả</label>
            <textarea
              className='form-control'
              rows={4}
              value={formData.author_note}
              onChange={(e) =>
                setFormData({ ...formData, author_note: e.target.value })
              }
            />
          </div>

          {/* BLOCK EDITOR */}
          <div className=''>
            <label className='form-label fw-semibold'>Nội dung chương</label>
            {formData.blocks.map((block, index) => (
              <div key={index}>
                {/* TEXT */}
                {block.type === 'text' && (
                  <TextBlock
                    block={block}
                    index={index}
                    updateBlock={updateBlock}
                    deleteBlock={deleteBlock}
                  />
                )}

                {/* IMAGE */}
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
          <div className='d-flex justify-content-center mt-3'>
            <button className='btn btn-success px-4' disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default EditChapter
