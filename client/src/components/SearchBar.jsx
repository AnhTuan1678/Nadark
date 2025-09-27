import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import styles from './SearchBar.module.css'

const SearchBar = ({ className, onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(query)
  }

  return (
    <form className={`${styles['search-bar']} ${className}`} onSubmit={handleSubmit}>
      <input
        type='text'
        className={styles['search-input']}
        placeholder='Tìm kiếm...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type='submit' className={styles['search-btn']}>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </button>
    </form>
  )
}

export default SearchBar
