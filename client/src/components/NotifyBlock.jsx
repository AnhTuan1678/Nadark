import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const NotifyBlock = ({ children, icon = faInfoCircle }) => {
  return (
    <div
      className={`d-flex align-items-stretch p-0 overflow-hidden`}
      style={{
        border: '1px solid var(--color-NotifyBlock-border)',
        background: 'var(--background-NotifyBlock)',
      }}>
      <div
        className={`d-flex align-items-center justify-content-center p-1 p-md-2 text-white`}
        style={{ background: 'var(--background-NotifyBlock-icon)' }}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className='p-1 p-md-2 d-block flex-grow-1 fs-7'>
        <span className='dot position-relative d-inline-block'>
          <span className='ping'></span>
          <span className='core bg-danger'></span>
        </span>
        &nbsp;
        {children}
      </div>
    </div>
  )
}

export default NotifyBlock
