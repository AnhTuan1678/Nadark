import { useState, useEffect } from 'react'
import { bookAPI } from '../services/api'
import styles from './SearchPage.module.css'
import genresData from '../assets/genres.json'
import StoryCard from '../components/StoryCard'

const SearchPage = () => {
  const [query, setQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState([]) // mảng id
  const [minChapter, setMinChapter] = useState(0)
  const [maxChapter, setMaxChapter] = useState(1e6)
  const [limit, setLimit] = useState(3600)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Quản lý trạng thái nút tìm kiếm
  const [disabled, setDisabled] = useState(true)
  useEffect(() => {
    if (!query.trim()) setDisabled(true)
    else setDisabled(false)
  }, [query])

  const handleGenreToggle = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    )
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const results = await bookAPI.searchBooks({
        query,
        genres: selectedGenres,
        minChapter,
        maxChapter,
        limit,
      })
      setBooks(results)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Tìm kiếm thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tìm kiếm sách</h2>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type='text'
          placeholder='Nhập tên sách hoặc tác giả'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.input}
        />

        <div className={styles.chapterRange}>
          <label>Chương từ:</label>
          <input
            type='number'
            min={0}
            value={minChapter}
            onChange={(e) => setMinChapter(Number(e.target.value))}
          />
          <label>đến:</label>
          <input
            type='number'
            min={0}
            value={maxChapter}
            onChange={(e) => setMaxChapter(Number(e.target.value))}
          />
        </div>

        <div className={styles.genreContainer}>
          <h3>Thể loại</h3>
          <div className={styles.genreGrid6}>
            {genresData.map((g) => (
              <label
                key={g.id}
                className={`${styles.genreItem} ${
                  selectedGenres.includes(g.id) ? styles.selected : ''
                } fs-7 m-0 p-1`}
                title={g.description}>
                <input
                  type='checkbox'
                  checked={selectedGenres.includes(g.id)}
                  onChange={() => handleGenreToggle(g.id)}
                />
                <span className={styles.genreName}>{g.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type='submit'
          disabled={disabled || loading}
          className={styles.submit}>
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </form>

      <div className={styles.results}>
        {books.length === 0 && !loading && <p>Không có kết quả</p>}
      </div>
      <div className='row ps-4 pe-4'>
        {books.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  )
}

export default SearchPage
