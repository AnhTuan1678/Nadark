import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { bookAPI } from '../../services/api'
import EmptyState from '../../components/EmptyState'
import SearchForm from './SearchForm'
import PaginatedBooks from './PaginatedBooks'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const limit = 360

  const handleSearch = async ({ query, genres, minChapter, maxChapter }) => {
    setLoading(true)
    setError('')
    try {
      const results = await bookAPI.searchBooks({
        query,
        genres,
        minChapter,
        maxChapter,
        limit,
      })
      setBooks(results)
    } catch (err) {
      setError(err.message || 'Tìm kiếm thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (data) => {
    // Cập nhật URL params
    const params = {}
    if (data.query) params.query = data.query
    if (data.genres.length) params.genre = data.genres.join(',')
    if (data.minChapter > 0) params.minChapter = data.minChapter
    if (data.maxChapter < 1e6) params.maxChapter = data.maxChapter
    Object.keys(params).length ? setSearchParams(params) : navigate('/')

    handleSearch(data)
  }

  useEffect(() => {
    // Khi vào trang với searchParams
    const q = searchParams.get('query') || ''
    const g = searchParams.get('genre')?.split(',').map(Number) || []
    const min = Number(searchParams.get('minChapter') || 0)
    const max = Number(searchParams.get('maxChapter') || 1e6)

    if (q || g.length || min > 0 || max < 1e6) {
      handleSearch({ query: q, genres: g, minChapter: min, maxChapter: max })
    } else {
      setBooks([])
    }
  }, [searchParams])

  return (
    <>
      <h2 className='page-title mb-4'>Tìm kiếm sách</h2>
      <div className='row flex-grow-1'>
        <SearchForm
          initialData={{
            query: searchParams.get('query') || '',
            selectedGenres:
              searchParams.get('genre')?.split(',').map(Number) || [],
            minChapter: Number(searchParams.get('minChapter') || 0),
            maxChapter: Number(searchParams.get('maxChapter') || 1e6),
          }}
          onSubmit={handleSubmit}
          loading={loading}
          className='col col-12 col-md-4 p-2 rounded h-100'
        />

        <div className='col col-12 col-md-8 d-flex flex-column'>
          {loading ? (
            <EmptyState message='🔍 Đang tìm kiếm...' />
          ) : error ? (
            <EmptyState message={error} />
          ) : !books || books.length === 0 ? (
            <EmptyState message='Không có kết quả' />
          ) : (
            <PaginatedBooks books={books} />
          )}
        </div>
      </div>
    </>
  )
}

export default SearchPage
