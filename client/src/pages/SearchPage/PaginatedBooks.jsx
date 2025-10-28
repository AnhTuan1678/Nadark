import { useState } from 'react'
import StoryCard from '../../components/StoryCard'
import Pagination from '../../components/Pagination'

const PaginatedBooks = ({ books = [], booksPerPage = 36 }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(books.length / booksPerPage) || 1
  const startIndex = (currentPage - 1) * booksPerPage
  const endIndex = startIndex + booksPerPage
  const currentBooks = books.slice(startIndex, endIndex)

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className='row ps-1 pe-1'>
        {currentBooks.map((book) => (
          <StoryCard
            key={book.id}
            story={book}
            className='col-4 col-md-3 col-lg-2 p-0'
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChangePage={handleChangePage}
        />
      )}
    </>
  )
}

export default PaginatedBooks
