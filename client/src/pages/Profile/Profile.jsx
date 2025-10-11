import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userAPI, progressAPI } from '../../services/api'
import { formatterProfile } from '../../utils/formatter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { updateAvatar as updateAvatarAction } from '../../redux/userSlice'
import EmptyState from '../../components/EmptyState'
import ProfileHeader from './ProfileHeader'
import ProfileInfo from './ProfileInfo'
import StoriesPosted from './StoriesPosted'
import ProgressList from './ProgressList'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [progress, setProgress] = useState([])
  const [booksUploaded, setBooksUploaded] = useState(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const query = new URLSearchParams(location.search)
  const userId = query.get('user') // id của chủ profile

  useEffect(() => {
    const uid = userId || user.id
    if (!uid) return
    const fetchData = async () => {
      try {
        const [data, progress, books] = await Promise.all([
          userAPI.getUserById(uid),
          progressAPI.getUserProgress(uid, { limit: 12 }),
          userAPI.getUserBooks(uid),
        ])

        setProfile(formatterProfile(data))
        setProgress(progress.data || [])
        setBooksUploaded(books.data)
      } catch (err) {
        console.error('Lỗi fetch profile/progress:', err)
      }
    }
    fetchData()
  }, [user.id, userId])

  if (!user.isLoggedIn) return <EmptyState message='Chưa đăng nhập' />

  // upload avatar (handled in parent)
  const handleAvatarSelected = async (file) => {
    if (!file) return
    setIsUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const updatedProfile = await userAPI.updateAvatar(user.token, formData)
      setProfile(updatedProfile)
      dispatch(updateAvatarAction(updatedProfile.avatarUrl))
    } catch (err) {
      console.error('Cập nhật avatar thất bại', err)
      alert('Cập nhật avatar thất bại')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    profile && (
      <div className='container my-4 flex-grow-1'>
        {/* overlay khi upload */}
        {isUploadingAvatar && (
          <div className='cus-overlay' style={{ zIndex: 100 }}>
            <span>Uploading...</span>
          </div>
        )}

        {/* header */}
        <ProfileHeader
          profile={profile}
          onFileSelected={handleAvatarSelected}
        />

        {/* nút đổi mật khẩu */}
        <div
          className={`d-flex justify-content-end mb-4 mt-5 ${
            user.id !== profile.id && 'invisible'
          }`}>
          <button
            className='btn btn-warning text-white'
            onClick={() =>
              navigate('/auth?action=cp', {
                state: { from: location.pathname },
              })
            }>
            <FontAwesomeIcon icon={faKey} className='me-2' />
            Đổi mật khẩu
          </button>
        </div>

        {/* thông tin + stories */}
        <div className='row'>
          <ProfileInfo profile={profile} />

          <div className='col-md-8 m-0 p-0'>
            <StoriesPosted stories={booksUploaded} />
            <ProgressList progress={progress} />
          </div>
        </div>
      </div>
    )
  )
}

export default Profile
