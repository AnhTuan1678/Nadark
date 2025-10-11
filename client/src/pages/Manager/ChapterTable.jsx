import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSearch } from '@fortawesome/free-solid-svg-icons'
import styles from './Styles.module.css'
import { timeAgo } from '../../utils/timeAgo'
import EmptyState from '../../components/EmptyState'

const ChapterTable = ({ chapters = [], onDelete = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Lọc chương theo tiêu đề hoặc số chương
  const filteredChapters = useMemo(() => {
    if (!Array.isArray(chapters)) return []
    if (!searchTerm.trim()) return chapters
    const lower = searchTerm.toLowerCase()
    return chapters.filter(
      (ch) =>
        ch.title.toLowerCase().includes(lower) ||
        ch.index.toString().includes(lower),
    )
  }, [chapters, searchTerm])

  return (
    <div className='h-100 d-flex flex-column p-2'>
      {/* Ô tìm kiếm */}
      <div className='d-flex align-items-center mb-3'>
        <FontAwesomeIcon icon={faSearch} className='me-2' />
        <input
          type='text'
          className='form-control form-control-sm bg-transparent border-secondary'
          placeholder='Tìm chương theo tiêu đề hoặc số chương...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Bảng có cuộn dọc */}
      <div
        className={`table-responsive flex-grow-1 h-100 p-x2 bg-transparent ${styles.table}`}>
        <table
          className={`table table-hover align-middle mb-3 ${styles.transparentTable}`}>
          <thead
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 20,
              background: 'var(--color-container-background',
            }}>
            <tr>
              <th style={{ width: '10%' }}>#</th>
              <th>Tiêu đề</th>
              <th style={{ width: '25%' }}>Cập nhật</th>
              <th style={{ width: '10%' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredChapters.length === 0 ? (
              <tr>
                <td colSpan='4' className='text-center text-secondary'>
                  Không tìm thấy chương phù hợp
                </td>
              </tr>
            ) : (
              filteredChapters.map((ch) => (
                <tr className='bg-transparent' key={ch.chapterId}>
                  <td>{ch.index}</td>
                  <td>{ch.title}</td>
                  <td>{timeAgo(ch.releaseDate)}</td>
                  <td>
                    <button
                      className={`btn btn-sm btn-danger ${styles.btnAction}`}
                      onClick={() => onDelete?.(ch.chapterId)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ChapterTable
