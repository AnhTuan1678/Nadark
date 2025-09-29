import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StoryDetail from './pages/StoryDetail'
import Reader from './pages/Reader'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/LoginPopup'
import Profile from './pages/Profile'
import Bookshelf from './pages/Bookshelf'

function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/story/:id' element={<StoryDetail />} />
          <Route path='/story/:id/chapter/:chapterId' element={<Reader />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/bookshelf' element={<Bookshelf />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
