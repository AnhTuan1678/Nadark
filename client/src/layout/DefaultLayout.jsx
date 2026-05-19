import NotifyBlock from '../components/NotifyBlock'

const DefaultLayout = ({ children }) => {
  return (
    <div className='container cus-container shadow flex-grow-1 d-flex flex-column'>
      <NotifyBlock>
        <strong>Lưu ý:</strong> Một số ảnh trên trang web có thể không hiển thị do đã bị xóa bởi tác giả hoặc vấn đề bản quyền.
      </NotifyBlock>
      {children}
    </div>
  )
}

export default DefaultLayout
