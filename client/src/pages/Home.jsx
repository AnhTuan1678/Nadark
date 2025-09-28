import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className='container'>
      <h2>Welcome to the Home Page</h2>
      <button onClick={() => navigate(`/story/14`)}>Click Me</button>
    </div>
  )
}

export default Home
