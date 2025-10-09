import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGenres } from '../../redux/genreSlice'
import { reviewAPI, bookAPI, progressAPI } from '../../services/api'
import Loading from '../../components/Loading'
import StoryInfoSection from './StoryInfoSection'
import StoryChaptersSection from './StoryChaptersSection'
import StoryReviewsSection from './StoryReviewsSection'

const StoryDetail = () => {
  const { id } = useParams()
  const [storyDetails, setStoryDetails] = useState(null)
  const [chapters, setChapters] = useState(null)
  const [progress, setProgress] = useState(null)
  const [reviews, setReviews] = useState([])

  const currentUser = useSelector((state) => state.user)
  const genres = useSelector((state) => state.genre.list)
  const dispatch = useDispatch()

  // fetch genres
  useEffect(() => {
    if (!genres.length) dispatch(fetchGenres())
  }, [dispatch, genres.length])

  // fetch story details
  useEffect(() => {
    const fetchData = async () => {
      const data = await bookAPI.getStoryDetails(id)
      setStoryDetails(data)
    }
    fetchData()
  }, [id])

  // fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      const data = await bookAPI.getChapters(id)
      setChapters(data)
    }
    fetchChapters()
  }, [id])

  // fetch progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser.token) return
      try {
        const data = await progressAPI.getProgressByBook(currentUser.token, id)
        setProgress(data)
      } catch (err) {
        console.warn('Không có tiến trình đọc:', err)
      }
    }
    fetchProgress()
  }, [currentUser.token, id])

  // fetch reviews
  useEffect(() => {
    const fetchReview = async () => {
      const data = await reviewAPI.getReviewsByBook(id)
      setReviews(data)
    }
    fetchReview()
  }, [currentUser.id, id])

  if (!storyDetails || !chapters) return <Loading />

  return (
    <div className='container mx-auto p-0 p-top-4 p-end-4 flex-grow-1'>
      <StoryInfoSection
        storyDetails={storyDetails}
        genres={genres}
        progress={progress}
      />
      <StoryChaptersSection
        bookId={id}
        storyDetails={storyDetails}
        chapters={chapters}
        progress={progress}
      />
      <StoryReviewsSection bookId={id} reviews={reviews} />
    </div>
  )
}

export default StoryDetail
