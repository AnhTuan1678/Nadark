const Loading = () => {
  return (
    <div className='d-flex justify-content-center align-items-center flex-grow-1'>
      <div className='spinner-border text-muted' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  )
}

export default Loading