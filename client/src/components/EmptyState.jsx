const EmptyState = ({ message = 'Không có dữ liệu' }) => (
  <div className='d-flex justify-content-center align-items-center flex-grow-1 text-center'>
    <p className='text-muted'>{message}</p>
  </div>
)

export default EmptyState
