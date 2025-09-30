import { useEffect, useState } from 'react'
import { getProfile } from '../services/api'
import { formatterProfile } from '../utils/formatter'

const Profile = () => {
  const [profile, setProfile] = useState()

  console.log(profile)
  // lấy profile
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token')
      const data = await getProfile(token)
      setProfile(formatterProfile(data))
    }
    fetchData()
  }, [])

  if (!localStorage.getItem('token')) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <p className='text-muted'>Bạn chưa đăng nhập</p>
      </div>
    )
  }

  return (
    profile && (
      <div className='container my-4 flex-grow-1'>
        {/* Header */}
        <div className='position-relative mb-4'>
          <div
            className='w-100'
            style={{
              height: '200px',
              backgroundColor: '#aaa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#fff',
              fontWeight: 'bold',
            }}>
            Background
          </div>
          <div
            className='position-absolute  d-flex flex-column align-items-center'
            style={{ bottom: '-90px', left: '20px' }}>
            <img
              src={profile.avatarUrl}
              alt='avatar'
              className='rounded-circle border border-dark'
              style={{ width: '100px', height: '100px' }}
            />
            <h4>{profile.username}</h4>
          </div>
        </div>

        {/* Username and contact */}
        <div
          className='d-flex justify-content-between align-items-center mb-4'
          style={{ marginTop: '30px' }}>
          <div></div>
          <button className='btn btn-success'>
            <i className='bi bi-send-fill'></i> Liên hệ
          </button>
        </div>

        <div className='row'>
          {/* Left: Progress & tags */}
          <div className='col-md-4 mb-4'>
            <div className='card p-3'>
              <h5>{profile.level}</h5>
              <div className='progress mb-2' style={{ height: '20px' }}>
                <div
                  className='progress-bar'
                  role='progressbar'
                  style={{ width: `${profile.progressPercent}%` }}
                  aria-valuenow={profile.progressPercent}
                  aria-valuemin='0'
                  aria-valuemax='100'>
                  Bước 1
                </div>
              </div>
              <p>{profile.status}</p>
              <div className='p-0 m-0'>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'>
                    <strong>Tên đăng nhập:</strong> {profile.username}
                  </li>
                  <li className='list-group-item'>
                    <strong>Email:</strong> {profile.email}
                  </li>
                  <li className='list-group-item'>
                    <strong>Sinh thần:</strong> {profile.id}
                  </li>
                  <li className='list-group-item'>
                    <strong>Ngày tạo:</strong>{' '}
                    {new Date(profile.createdDate).toLocaleString()}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Story info */}
          <div className='col-md-8'>
            <div className='mb-3'>
              <h5 className='border-bottom pb-2'>
                Truyện đã đăng ({profile.storiesPosted})
              </h5>
              {profile.storiesPosted === 0 && <p>Không có truyện nào</p>}
            </div>
            <div className='mb-3'>
              <h5 className='border-bottom pb-2'>
                Truyện đang tham gia ({profile.storiesJoined})
              </h5>
              {profile.storiesJoined === 0 && <p>Không có truyện nào</p>}
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default Profile
