const Pagination = ({ page, totalPages, onChangePage }) => {
  const createPageArray = () => {
    const pages = []

    // 2 trang đầu
    for (let i = 1; i <= Math.min(2, totalPages); i++) {
      pages.push(i)
    }

    // trang xung quanh trang hiện tại ±3
    const start = Math.max(3, page - 3)
    const end = Math.min(totalPages - 2, page + 3)

    if (start > 3) {
      pages.push('left-ellipsis') // dấu ...
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 2) {
      pages.push('right-ellipsis') // dấu ...
    }

    // 2 trang cuối
    for (let i = Math.max(totalPages - 1, 3); i <= totalPages; i++) {
      pages.push(i)
    }

    // loại trùng lặp
    return [...new Set(pages)]
  }

  const pagesToShow = createPageArray()

  return (
    <div className='d-flex justify-content-center my-4'>
      <nav>
        <ul className='pagination'>
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button
              className='page-link'
              onClick={() => onChangePage(page - 1)}>
              &laquo;
            </button>
          </li>

          {pagesToShow.map((p, idx) =>
            p === 'left-ellipsis' || p === 'right-ellipsis' ? (
              <li key={idx} className='page-item disabled'>
                <span className='page-link'>...</span>
              </li>
            ) : (
              <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                <button className='page-link' onClick={() => onChangePage(p)}>
                  {p}
                </button>
              </li>
            ),
          )}

          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button
              className='page-link'
              onClick={() => onChangePage(page + 1)}>
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Pagination
