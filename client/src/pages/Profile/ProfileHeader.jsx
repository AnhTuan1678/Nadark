import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import styles from './Profile.module.css'
import { useSelector } from 'react-redux'

const ProfileHeader = ({ profile, onFileSelected }) => {
  const user = useSelector((state) => state.user)
  const fileInputRef = useRef(null)

  const handleAvatarClick = () => {
    if (user.id === profile.id) fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && onFileSelected && user.id === profile.id) {
      onFileSelected(file) // gửi file về Profile parent
    }
  }

  return (
    <div className='position-relative mb-5'>
      <div
        className='w-100 bg-secondary d-flex align-items-center justify-content-center text-white fw-bold'
        style={{ height: '200px', fontSize: '2rem' }}>
        Background
      </div>

      <div
        className='position-absolute start-0 ms-3 d-flex flex-column align-items-center'
        style={{ bottom: '-90px' }}>
        <div
          className={`position-relative rounded-circle border border-dark overflow-hidden ${styles.avatar}`}>
          <img
            src={profile?.avatarUrl || './avatar.png'}
            alt='avatar'
            style={{ width: '100px', height: '100px' }}
          />
          {user.id === profile.id && (
            <div
              className={`btn position-absolute bottom-0 start-0 w-100 ${styles.cusBtn}`}
              onClick={handleAvatarClick}>
              <FontAwesomeIcon icon={faFolder} />
            </div>
          )}
          <input
            type='file'
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>
        <h4 className='mt-2'>{profile?.username}</h4>
      </div>
    </div>
  )
}

export default ProfileHeader
