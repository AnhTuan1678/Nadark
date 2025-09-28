// src/pages/Profile.jsx
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <p className='text-muted'>Bạn chưa đăng nhập</p>
      </div>
    )
  }

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card shadow-sm border-0 rounded-3'>
            <div className='card-header bg-primary text-white text-center'>
              <h4 className='mb-0'>Thông tin cá nhân</h4>
            </div>
            <div className='card-body'>
              <ul className='list-group list-group-flush'>
                <li className='list-group-item'>
                  <strong>ID:</strong> {user.id}
                </li>
                <li className='list-group-item'>
                  <strong>Tên đăng nhập:</strong> {user.username}
                </li>
                <li className='list-group-item'>
                  <strong>Email:</strong> {user.email}
                </li>
                <li className='list-group-item'>
                  <strong>Cài đặt cá nhân:</strong>
                  <pre className='bg-light p-2 rounded mt-1 mb-0 small'>
                    {JSON.stringify(user.personal_settings, null, 2)}
                  </pre>
                </li>
                <li className='list-group-item'>
                  <strong>Ngày tạo:</strong>{' '}
                  {new Date(user.created_at).toLocaleString()}
                </li>
                <li className='list-group-item'>
                  <strong>Cập nhật gần nhất:</strong>{' '}
                  {new Date(user.updated_at).toLocaleString()}
                </li>
              </ul>
            </div>
            <div className='card-footer text-center'>
              <button className='btn btn-outline-primary btn-sm me-2'>
                Chỉnh sửa
              </button>
              <button className='btn btn-outline-danger btn-sm'>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
