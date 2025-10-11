// src/pages/index.js
import { lazy } from 'react'

// 🧩 Dùng React.lazy để code-split từng trang
export const Home = lazy(() => import('./Home'))
export const StoryDetail = lazy(() => import('./StoryDetail'))
export const Reader = lazy(() => import('./Reader'))
export const Profile = lazy(() => import('./Profile'))
export const Bookshelf = lazy(() => import('./Bookshelf'))
export const AddStory = lazy(() => import('./AddStory'))
export const AddChapter = lazy(() => import('./AddChapter'))
export const Tutorial = lazy(() => import('./Tutorial'))
export const RecentlyRead = lazy(() => import('./Recently'))
export const UserAuth = lazy(() => import('./UserAuth'))
export const Settings = lazy(() => import('./Settings'))
export const SearchPage = lazy(() => import('./SearchPage/SearchPage'))
export const NotFound = lazy(() => import('./NotFound'))
export const Hot = lazy(() => import('./Hot'))
