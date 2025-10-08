export const CommentItem = ({ comment }) => {
  return (
    <div className='d-flex mb-1 position-relative'>
      <img
        src={comment?.User?.avatar_url || '/default-avatar.png'}
        alt={comment?.User?.username || 'Người dùng'}
        className='rounded-circle me-3'
        width={40}
        height={40}
      />

      <div className='rounded p-1 w-100 position-relative cus-comment'>
        {/* Rating góc trên bên phải */}
        {comment.rating != null && (
          <div
            className='position-absolute fs-6 fs-bold top-0 end-0 me-1'>
            {Array.from({ length: comment.rating }).map((_, i) => (
              <span className='text-warning' key={i}>
                ★
              </span>
            ))}
            {Array.from({ length: 5 - comment.rating }).map((_, i) => (
              <span key={i} style={{ color: '#ffffffff' }}>
                ★
              </span>
            ))}
          </div>
        )}

        <a href={`/user?id=${comment?.User?.id}`} className='ms-1 fs-6 fs-md-7 fw-bold'>
          {comment?.User?.username}
        </a>
        <p className='mb-0 ms-1 fs-6 fs-md-7' style={{ whiteSpace: 'pre-wrap' }}>
          {comment.content}
        </p>
      </div>
    </div>
  )
}
