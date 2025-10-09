const Footer = () => (
  <div className='bg-dark text-white'>
    <div className='container'>
      <div className='row p-2 p-md-4'>
        {/* Cột 1: Thông tin liên hệ */}
        <div className='col-md-4 p-0 m-0'>
          <h5 className='fs-5'>Liên hệ</h5>
          <p className='mb-1'>
            <a
              href='https://www.facebook.com/phamanhtuan16062003/'
              target='_blank'
              rel='noopener noreferrer'
              className='fs-7'>
              Facebook
            </a>
          </p>
          <p className='mb-1 text-info fs-7'>
            <span>Gmail: </span>phamanhtuan16062003@gmail.com
          </p>
          <p className='mb-1 text-info fs-7'>
            <span style={{ visibility: 'hidden' }}>Gmail: </span>
            21020397@gmail.com
          </p>
          <p className='mb-0 fs-7'>
            SĐT: 0839817228{' '}
            <span className='text-warning'>(không khuyến khích)</span>
          </p>
        </div>

        {/* Cột 2: Từ chối trách nhiệm */}
        <div className='col-md-8 p-0 m-0'>
          <p className='p-0 m-0 fst-italic text-secondary fs-6 fs-md-7'>
            <strong className='text-danger fst-normal fs-6 fs-md-7'>
              Từ chối trách nhiệm:
            </strong>{' '}
            Toàn bộ các truyện được đăng tải trên trang web được sưu tầm chủ yếu
            từ{' '}
            <a
              href='https://docln.net/'
              className='text-info text-decoration-none fs-6 fs-md-7'>
              Hako
            </a>
            , và tôi không chịu trách nhiệm về bản quyền hoặc quyền sở hữu đối
            với bất kỳ nội dung nào. Nếu bạn là chủ sở hữu bản quyền và cho rằng
            nội dung trên trang vi phạm quyền của bạn, vui lòng liên hệ để tiến
            hành gỡ bỏ nội dung vi phạm kịp thời.
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default Footer
