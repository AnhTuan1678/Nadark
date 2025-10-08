import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faExclamationCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css'

const Snackbar = ({
  status = 'success',
  message = '',
  onClose,
  progress,
  closing,
}) => {
  const [hideAnim, setHideAnim] = useState(false)

  // Khi ấn nút close, bật animation rồi gọi onClose
  const handleClose = () => setHideAnim(true)

  useEffect(() => {
    if (hideAnim) {
      const t = setTimeout(onClose, 300)
      return () => clearTimeout(t)
    }
  }, [hideAnim, onClose])

  useEffect(() => {
    if (closing) setHideAnim(true)
  }, [closing])

  // Chọn màu và icon
  let bgClass = 'bg-success'
  let icon = faCheckCircle
  if (status === 'error') {
    bgClass = 'bg-danger'
    icon = faTimesCircle
  } else if (status === 'warning') {
    bgClass = 'bg-warning'
    icon = faExclamationCircle
  }

  const animClass = hideAnim
    ? 'animate__animated animate__fadeOutRight animate__faster'
    : 'animate__animated animate__fadeInLeft animate__faster'

  return (
    <div
      className={`toast show m-1 ${bgClass} text-white ${animClass}`}
      role='alert'
      aria-live='assertive'
      aria-atomic='true'>
      <div className='d-flex flex-column'>
        <div className='d-flex'>
          <div className='toast-body d-flex align-items-center fs-6 fs-md-7'>
            <FontAwesomeIcon icon={icon} className='me-2' />
            {message}
          </div>
          <button
            type='button'
            className='btn-close btn-close-white me-2 m-auto'
            aria-label='Close'
            onClick={handleClose}></button>
        </div>
        {/* Thanh tiến trình */}
        <div
          style={{
            height: '4px',
            background: 'rgba(255,255,255,0.5)',
            width: `${progress}%`,
            transition: 'width 50ms linear',
            borderRadius: '2px',
            marginTop: '2px',
          }}></div>
      </div>
    </div>
  )
}

export default Snackbar
