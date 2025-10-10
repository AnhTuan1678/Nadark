import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import * as Pages from './pages'

import DefaultLayout from './layout/DefaultLayout'
import TwoColumnLayout from './layout/TwoColumnLayout'
import Header from './components/Header'
import Footer from './components/Footer'
import EmptyState from './components/EmptyState'

import { getProfile } from './services/api/user'
import { store } from './redux/store'
import { login, logout } from './redux/userSlice'
import { fetchGenres } from './redux/genreSlice'

function App() {
  // Lấy dữ liệu user + thể loại
  useEffect(() => {
    const token = localStorage.getItem('token')

    async function fetchProfile() {
      try {
        const data = await getProfile(token)
        if (!data.error) {
          store.dispatch(
            login({
              username: data.username,
              token,
              id: data.id,
              avatarUrl: data.avatar_url,
            }),
          )
        } else {
          store.dispatch(logout())
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error(error)
        store.dispatch(logout())
        localStorage.removeItem('token')
      }
    }

    if (token) fetchProfile()
    const state = store.getState()
    if (!state.genre?.list?.length) {
      store.dispatch(fetchGenres())
    }
  }, [])

  return (
    <div className='app'>
      <BrowserRouter>
        <Header />

        {/* Suspense để hiển thị khi trang đang tải */}
        <Suspense fallback={<div className='p-8 text-center'>Đang tải...</div>}>
          <Routes>
            <Route
              path='/'
              element={
                <TwoColumnLayout>
                  <Pages.Home />
                </TwoColumnLayout>
              }
            />
            <Route
              path='/story/:id'
              element={
                <DefaultLayout>
                  <Pages.StoryDetail />
                </DefaultLayout>
              }
            />
            <Route
              path='/story/:id/chapter/:chapterIndex'
              element={<Pages.Reader />}
            />
            <Route path='/profile' element={<Pages.Profile />} />

            <Route
              path='/bookshelf'
              element={
                <TwoColumnLayout>
                  <Pages.Bookshelf />
                </TwoColumnLayout>
              }
            />
            <Route path='/action/addBook' element={<Pages.AddStory />} />
            <Route path='/action/addChapter' element={<Pages.AddChapter />} />
            <Route path='/tutorial' element={<Pages.Tutorial />} />

            <Route
              path='/recently'
              element={
                <TwoColumnLayout>
                  <Pages.RecentlyRead />
                </TwoColumnLayout>
              }
            />

            <Route path='/user' element={<Pages.UserProfile />} />
            <Route path='/auth' element={<Pages.UserAuth />} />
            <Route
              path='/hot'
              element={
                <DefaultLayout>
                  <EmptyState message='Trang này vẫn chưa có gì' />
                </DefaultLayout>
              }
            />
            <Route
              path='/search'
              element={
                <DefaultLayout>
                  <Pages.SearchPage />
                </DefaultLayout>
              }
            />
            <Route
              path='/settings'
              element={
                <DefaultLayout>
                  <Pages.Settings />
                </DefaultLayout>
              }
            />
            <Route path='/*' element={<Pages.NotFound />} />
          </Routes>
        </Suspense>

        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
