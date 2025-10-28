import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Generic Dropdown
 * props:
 *  - label: string (nút hiển thị khi chưa mở)
 *  - options: [{ label: string, value: any }]
 *  - value: giá trị hiện tại
 *  - onChange: callback khi chọn
 *  - className: thêm class nếu muốn
 */
const Dropdown = ({
  label,
  options,
  value,
  onChange,
  className,
  classNameToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const dropdownRef = useRef(null)

  const toggleOpen = () => {
    if (isOpen) {
      setClosing(true)
      setTimeout(() => {
        setIsOpen(false)
        setClosing(false)
      }, 200)
    } else {
      setIsOpen(true)
    }
  }

  // đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (isOpen) {
          setClosing(true)
          setTimeout(() => {
            setIsOpen(false)
            setClosing(false)
          }, 200)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <button className={`border-0 ${classNameToggle}`} onClick={toggleOpen}>
        {label ? `${label} :` : ''} {value?.label || value || ''}
      </button>

      {isOpen || closing ? (
        <div
          className={`dropdown-menu p-0 animate__animated animate__faster ${
            isOpen && !closing
              ? 'animate__fadeInDown show'
              : closing
              ? 'animate__fadeOutUp show'
              : ''
          }`}>
          {options.map((opt, i) => (
            <button
              key={i}
              className='dropdown-item slide-in-hover'
              onClick={() => {
                onChange(opt)
                setClosing(true)
                setTimeout(() => {
                  setIsOpen(false)
                  setClosing(false)
                }, 300)
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default Dropdown
