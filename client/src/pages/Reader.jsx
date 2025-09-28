import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getChapterContent, getStoryDetails } from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBars,
} from '@fortawesome/free-solid-svg-icons'

const Reader = () => {
  const { chapterId, id } = useParams(1)
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [storyDetails, setStoryDetails] = useState({})

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getChapterContent(chapterId, id)
      setContent(data)
    }

    fetchContent()
  }, [chapterId, id])

  useEffect(() => {
    const fetchStoryDetails = async () => {
      const data = await getStoryDetails(id)
      setStoryDetails(data)
    }

    fetchStoryDetails()
  }, [id])

  const handleChapterNavigation = (className) => {
    return (
      <>
        <button
          className={`btn btn-primary ${className}`}
          onClick={() =>
            chapterId > 1 &&
            navigate(
              `/story/${storyDetails.id}/chapter/${parseInt(chapterId) - 1}`,
            )
          }>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <button
          className={`btn btn-primary ${className}`}
          onClick={() => navigate('/')}>
          <FontAwesomeIcon icon={faHome} />
        </button>

        <button
          className={`btn btn-primary ${className}`}
          onClick={() => navigate(`/story/${storyDetails.id}`)}>
          <FontAwesomeIcon icon={faBars} />
        </button>

        <button
          className={`btn btn-primary ${className}`}
          onClick={() =>
            storyDetails.chapterCount > chapterId &&
            navigate(
              `/story/${storyDetails.id}/chapter/${parseInt(chapterId) + 1}`,
            )
          }>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </>
    )
  }

  return (
    <>
      <div className='container mx-auto p-4'>
        {storyDetails && (
          <div className='text-center'>
            <button
              className='mb-4 cursor-pointer bg-transparent border-0'
              onClick={() => navigate(`/story/${storyDetails.id}`)}>
              <h1 className='text-center'>{storyDetails.title}</h1>
            </button>
          </div>
        )}
        {content && (
          <>
            <h3 className='text-center'>
              Chương {content.index}: {content.title}
            </h3>
            <div
              className={
                'justify-content-between mt-4 chapter-nav d-flex border rounded bg-light p-2'
              }>
              {handleChapterNavigation()}
            </div>
            <p className='fst-italic border-bottom pb-2 border-dark'>
              Ngày phát hành: {content.releaseDate}
            </p>
            <div>
              {content.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </>
        )}
        <div
          className={
            'justify-content-between mt-4 chapter-nav d-flex border rounded bg-light p-2'
          }>
          {handleChapterNavigation()}
        </div>
      </div>
      <div className='position-fixed bottom-0 end-0 p-4 d-flex flex-column gap-2'>
        {handleChapterNavigation('d-md-block d-none')}
        <button
          className='btn btn-primary'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
    </>
  )
}

export default Reader
