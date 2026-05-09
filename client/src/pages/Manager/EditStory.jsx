import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGenres } from '../../redux/genreSlice'
import { bookAPI } from '../../services/api'
import { useParams, useNavigate } from 'react-router-dom'
import './AddStory.css'
import GenreSelector from '../../components/GenreSelector'
import { clearCacheKey } from '../../services/cacheFetch'
import { API_URL } from '../../services/api/config'
import { mediaAPI } from '../../services/api'

const EditStory = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { list: genresData } = useSelector((state) => state.genre)
  const user = useSelector((state) => state.user)

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genres: [],
    summary: '',
    status: 'Đang tiến hành',
    coverImage: '',
  })

  const [imageMode, setImageMode] = useState('url') // url | file
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState('')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // genres
  useEffect(() => {
    if (!genresData.length) dispatch(fetchGenres())
  }, [dispatch, genresData.length])

  // load story
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const data = await bookAPI.getStoryDetails(id)
        console.log('Book details:', data)

        const genreIds = data.genres
          ? data.genres
              .map((g) => {
                const found = genresData.find((x) => x.name === g)
                return found ? found.id : null
              })
              .filter(Boolean)
          : []

        setFormData({
          title: data.title || '',
          author: data.author || '',
          genres: genreIds,
          summary: data.description || '',
          status: data.status || 'Đang tiến hành',
          coverImage: data.urlAvatar || '',
        })

        setPreviewImage(data.urlAvatar || '')
      } catch (err) {
        setError('Không tải được thông tin truyện.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBook()
  }, [genresData, id])

  // input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // validate image url
  const isValidImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')

    try {
      let imageUrl = formData.coverImage

      // upload file
      if (imageMode === 'file' && imageFile) {
        const res = await mediaAPI.uploadMedia(user.token, imageFile)
        imageUrl = res.url
      }

      // validate url
      if (imageMode === 'url' && imageUrl) {
        const valid = await isValidImageUrl(imageUrl)
        if (!valid) throw new Error('Link ảnh không hợp lệ')
      }

      const payload = {
        title: formData.title,
        author: formData.author,
        description: formData.summary,
        genres: formData.genres,
        status: formData.status,
        url_avatar: imageUrl,
      }

      const updatedBook = await bookAPI.updateBook(id, payload, user.token)

      setSuccess(`Đã cập nhật truyện: ${updatedBook.title}`)

      await clearCacheKey(`${API_URL}/api/book/${id}`)

      setTimeout(() => navigate(-1), 1000)
    } catch (err) {
      setError(err.message || 'Có lỗi khi cập nhật truyện.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container border cus-container shadow-sm p-4 flex-grow-1'>
      <h3 className='mb-4 text-center text-primary'>
        Chỉnh sửa thông tin truyện
      </h3>

      {success && <div className='alert alert-success'>{success}</div>}
      {error && <div className='alert alert-danger'>{error}</div>}

      {loading && !formData.title ? (
        <div className='text-center'>Đang tải dữ liệu...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='row g-3'>
            {/* TITLE */}
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

            {/* AUTHOR */}
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

            {/* STATUS */}
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

            {/* GENRES */}
            <div className='col-12'>
              <GenreSelector
                selectedGenres={formData.genres}
                onChange={(ids) =>
                  setFormData((prev) => ({ ...prev, genres: ids }))
                }
                classNameTitle='form-label fw-semibold mb-0'
              />
            </div>

            {/* SUMMARY */}
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

            {/* COVER IMAGE */}
            <div className='col-12'>
              <label className='form-label fw-semibold'>Ảnh bìa</label>

              <div className='d-flex gap-3 mb-2'>
                <label>
                  <input
                    type='radio'
                    checked={imageMode === 'url'}
                    onChange={() => setImageMode('url')}
                  />{' '}
                  Link
                </label>

                <label>
                  <input
                    type='radio'
                    checked={imageMode === 'file'}
                    onChange={() => setImageMode('file')}
                  />{' '}
                  Upload
                </label>
              </div>

              {imageMode === 'url' && (
                <input
                  type='text'
                  className='form-control'
                  placeholder='Nhập link ảnh...'
                  value={formData.coverImage}
                  onChange={(e) => {
                    const value = e.target.value
                    setFormData((prev) => ({
                      ...prev,
                      coverImage: value,
                    }))
                    setPreviewImage(value)
                  }}
                />
              )}

              {imageMode === 'file' && (
                <input
                  type='file'
                  className='form-control'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files[0]
                    setImageFile(file)

                    if (file) {
                      setPreviewImage(URL.createObjectURL(file))
                    }
                  }}
                />
              )}

              {/* PREVIEW */}
              {previewImage && (
                <div className='mt-3 text-center'>
                  <label className='form-label fw-semibold'>
                    Xem trước ảnh
                  </label>

                  <div>
                    <img
                      src={previewImage}
                      alt='preview'
                      style={{
                        width: '200px',
                        height: '280px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SUBMIT */}
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
