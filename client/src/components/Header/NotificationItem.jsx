import { useEffect, useState } from 'react'
import { formatNotification } from '../../utils/formatNotification.jsx'

const NotificationItem = ({ item, onRead, className }) => {
  const [formattedItem, setFormattedItem] = useState(item)

  useEffect(() => {
    const run = async () => {
      const data = await formatNotification(item)
      setFormattedItem(data)
    }

    run()
  }, [item])

  return (
    <div
      onClick={() => onRead(formattedItem)}
      className={`p-1 border-bottom cursor-pointer slide-in-hover ${className}`}>
      {formattedItem.content || (
        <div className='fw-semibold'>{formattedItem.text}</div>
      )}
    </div>
  )
}

export default NotificationItem
