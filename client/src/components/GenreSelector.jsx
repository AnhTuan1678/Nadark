import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGenres } from '../redux/genreSlice'

const GenreSelector = ({
  selectedGenres = [],
  onChange = (all) => {
    console.log(all)
  },
  classNameTitle,
  className,
}) => {
  const [showGenres, setShowGenres] = useState(false)
  const dispatch = useDispatch()
  const { list: genresData } = useSelector((state) => state.genre)

  const [selected, setSelected] = useState(new Set(selectedGenres))

  useEffect(() => {
    setSelected(new Set(selectedGenres))
  }, [selectedGenres])

  useEffect(() => {
    if (!genresData.length) dispatch(fetchGenres())
  }, [dispatch, genresData.length])

  const handleToggle = (id) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
    onChange(Array.from(newSelected))
  }

  return (
    <div className={`mb-3 ${className}`}>
      {/* Hiển thị danh sách tên đã chọn */}
      <div className='d-flex flex-wrap align-items-center gap-2 mb-2'>
        <h3 className={`h6 mb-0 ${classNameTitle}`}>Thể loại:</h3>
        {Array.from(selected).map((id) => (
          <span
            key={id}
            className='text-decoration-underline cursor-pointer opacity-hover-50 primary-color fst-italic'
            onClick={() => handleToggle(id)}>
            {genresData.find((g) => g.id === id)?.name}
          </span>
        ))}
      </div>

      {/* Nút ẩn/hiện */}
      <button
        type='button'
        className='btn btn-link btn-sm'
        onClick={() => setShowGenres((prev) => !prev)}>
        {showGenres ? '[Ẩn]' : '[Hiện]'}
      </button>

      {/* Danh sách checkbox */}
      <div
        className={`genre-container transition-collapse ${
          showGenres ? 'show' : 'hide'
        }`}>
        <div className='d-flex flex-wrap gap-2'>
          {genresData.map((g) => (
            <div key={g.id} className='form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                id={`genre-${g.id}`}
                checked={selected.has(g.id)}
                onChange={() => handleToggle(g.id)}
              />
              <label
                className='form-check-label'
                htmlFor={`genre-${g.id}`}
                title={g.description}>
                {g.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GenreSelector
