const Loading = ({ text }) => {
  return (
    <div className='d-flex justify-content-center align-items-center flex-grow-1'>
      {text && <p className='text-muted'>{text}</p>}
      <div className='spinner-border text-muted' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  )
}

export default Loading
