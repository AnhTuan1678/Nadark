import { useEffect, useState } from 'react'
import NotifyBlock from '../components/NotifyBlock'
import { bookAPI } from '../services/api'
import TopBooksTabs from './TopBookTabs'

const TwoColumnLayout = ({ children }) => {
  const [topBooksData, setTopBooksData] = useState([])
  useEffect(() => {
    const loadTop = async () => {
      try {
        const res = await bookAPI.getTopStoriesStats(10)
        setTopBooksData(res)
      } catch (err) {
        console.error('Lỗi khi lấy top truyện:', err)
      }
    }
    loadTop()
  }, [])

  return (
    <div className='container cus-container shadow flex-grow-1 d-flex flex-column'>
      <NotifyBlock>
        <strong>Lưu ý</strong> Đa số ảnh trên trang web đều cần vpn để load
      </NotifyBlock>
      <div className='row'>
        <div className='col col-12 col-md-8 d-flex flex-column'>{children}</div>
        <div className='col col-12 col-md-4 m-0 p-1'>
          <TopBooksTabs data={topBooksData} />
        </div>
      </div>
    </div>
  )
}

export default TwoColumnLayout
