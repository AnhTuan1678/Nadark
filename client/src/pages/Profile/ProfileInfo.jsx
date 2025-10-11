const ProfileInfo = ({ profile }) => {
  return (
    <div className='col-md-4 m-0 p-0 pe-1'>
      <div className='rounded border shadow p-3 cus-container'>
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
        <ul className='list-group list-group-flush'>
          <li className='list-group-item bg-transparent'>
            <strong>Username:</strong> {profile.username}
          </li>
          <li className='list-group-item bg-transparent'>
            <strong>Email:</strong> {profile.email}
          </li>
          <li className='list-group-item bg-transparent'>
            <strong>Ngày tạo:</strong>{' '}
            {new Date(profile.createdDate).toLocaleDateString()}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ProfileInfo
