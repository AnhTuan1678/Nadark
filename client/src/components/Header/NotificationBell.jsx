import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchNotifications,
  fetchUnreadCount,
  markReadLocal,
} from '../../redux/notificationSlice'
import { notificationAPI } from '../../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import NotificationItem from './NotificationItem'

const NotificationBell = ({ className }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const notifications = useSelector((state) => state.notifications.items)
  const unread = useSelector((state) => state.notifications.unread)

  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (!user?.token) return
    dispatch(fetchNotifications(user.token))
    dispatch(fetchUnreadCount(user.token))
  }, [dispatch, user])

  const handleRead = async (item) => {
    dispatch(markReadLocal(item.id))
    await notificationAPI.markRead(item.id, user.token)
    window.location.href = item.action
  }

  const onToggle = () => {
    if (open) {
      onClose()
    } else {
      setOpen(true)
    }
  }

  const onClose = () => {
    setClosing(true)
    setOpen(false)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 200)
  }

  return (
    <div className={`position-relative h-75 m-0 ${className}`}>
      {/* BUTTON */}
      <div
        className='p-0 d-flex justify-content-center align-items-center rounded-circle h-100'
        onClick={onToggle}
        style={{
          backgroundColor: 'var(--background-theme-toggle)',
          border: '1px solid gray',
          position: 'relative',
          aspectRatio: '1/1',
        }}>
        <FontAwesomeIcon
          icon={faBell}
          style={{ color: 'var(--color-theme-icon)' }}
        />

        {unread > 0 && (
          <span
            className='position-absolute rounded-circle'
            style={{
              width: 8,
              height: 8,
              top: 0,
              right: 0,
              backgroundColor: '#dc3545',
            }}
          />
        )}
      </div>

      {/* OVERLAY */}
      <div
        className={`cus-overlay animate__animated animate__faster ${
          open
            ? 'show animate__fadeIn'
            : closing
              ? 'show animate__fadeOut'
              : 'd-none'
        }`}
        style={{ zIndex: 100 }}
        onClick={onClose}></div>

      {/* DROPDOWN */}
      <div
        className={`position-absolute shadow rounded animate__animated animate__faster bg-body ${
          open
            ? 'show animate__fadeInDown'
            : closing
              ? 'animate__fadeOutUp show'
              : 'd-none'
        }`}
        style={{
          width: 350,
          right: 0,
          top: '100%',
          zIndex: 999,
          maxHeight: 500,
          overflowY: 'auto',
        }}>
        <h4 className='p-2 m-0 text-center border-bottom'>Thông báo</h4>

        {/* UNREAD */}
        <div>
          <div className='px-2 py-1 small fw-semibold text-danger'>
            Thông báo mới
          </div>

          {notifications.filter((n) => !n.is_read).length === 0 && (
            <div className='p-2 text-center text-muted border-bottom'>
              Không có thông báo mới
            </div>
          )}

          {notifications
            .filter((n) => !n.is_read)
            .map((item) => (
              <NotificationItem key={item.id} item={item} onRead={handleRead} />
            ))}
        </div>

        {/* READ */}
        <div className=''>
          <div className='px-2 py-1 small fw-semibold text-secondary'>
            Đã đọc
          </div>

          {notifications.filter((n) => n.is_read).length === 0 && (
            <div className='p-2 text-center text-muted border-top'>
              Chưa có thông báo đã đọc
            </div>
          )}

          {notifications
            .filter((n) => n.is_read)
            .map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onRead={handleRead}
                className='opacity-75'
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default NotificationBell
