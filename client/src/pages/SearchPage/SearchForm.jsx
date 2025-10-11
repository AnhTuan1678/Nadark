import { useState, useEffect } from 'react'
import GenreSelector from '../../components/GenreSelector'

const chapterRanges = [
  { label: 'Tất cả', min: 0, max: 1e6 },
  { label: '0 → 50', min: 0, max: 50 },
  { label: '50 → 200', min: 50, max: 200 },
  { label: '200 → 500', min: 200, max: 500 },
  { label: '> 500', min: 500, max: 1e6 },
]

const SearchForm = ({
  initialData = {},
  onSubmit,
  loading,
  className,
}) => {
  const [query, setQuery] = useState(initialData.query || '')
  const [selectedGenres, setSelectedGenres] = useState(
    initialData.selectedGenres || [],
  )
  const [minChapter, setMinChapter] = useState(initialData.minChapter ?? 0)
  const [maxChapter, setMaxChapter] = useState(initialData.maxChapter ?? 1e6)

  // Nếu cha reset initialData
  useEffect(() => {
    setQuery(initialData.query || '')
    setSelectedGenres(initialData.selectedGenres || [])
    setMinChapter(initialData.minChapter ?? 0)
    setMaxChapter(initialData.maxChapter ?? 1e6)
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ query, genres: selectedGenres, minChapter, maxChapter })
  }

  // Hiển thị label tương ứng với min/max
  const getRangeLabel = () => {
    const range = chapterRanges.find(
      (r) => r.min === minChapter && r.max === maxChapter,
    )
    return range ? range.label : 'Tùy chọn'
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className='mb-4'>
        {/* Input tìm kiếm */}
        <div className='mb-2 floating-label'>
          <input
            type='text'
            placeholder=''
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='form-control'
          />
          <label>Nhập tên sách hoặc tác giả</label>
        </div>

        {/* Khoảng chương */}
        <div className='mb-3'>
          <label className='form-label'>Số chương:</label>
          <select
            className='form-select w-auto d-inline-block'
            value={getRangeLabel()}
            onChange={(e) => {
              const range = chapterRanges.find(
                (r) => r.label === e.target.value,
              )
              if (range) {
                setMinChapter(range.min)
                setMaxChapter(range.max)
              }
            }}>
            {chapterRanges.map((r) => (
              <option key={r.label} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Thể loại */}
        <div className='mb-3'>
          <GenreSelector
            selectedGenres={selectedGenres}
            onChange={setSelectedGenres}
            showToggle
            classNameTitle='form-label fw-semibold mb-0'
          />
        </div>

        <button type='submit' disabled={loading} className='btn btn-primary'>
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>
    </div>
  )
}

export default SearchForm
