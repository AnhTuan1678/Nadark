import {
  faArrowLeft,
  faArrowRight,
  faBars,
  faCog,
  faHome,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'

const ChapterNavigation = ({
  storyDetails,
  chapterIndex,
  setShowTOC,
  setShowSettings,
  className,
}) => {
  const navigate = useNavigate()

  return (
    <>
      <button
        disabled={chapterIndex <= 1}
        className={`btn btn-primary ${className}`}
        onClick={() =>
          chapterIndex > 1 &&
          navigate(
            `/story/${storyDetails.id}/chapter/${parseInt(chapterIndex) - 1}`,
          )
        }>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <button
        className={`btn btn-primary ${className}`}
        onClick={() => navigate(`/story/${storyDetails.id}`)}>
        <FontAwesomeIcon icon={faHome} />
      </button>

      <button
        className={`btn btn-primary ${className}`}
        onClick={() => setShowTOC(true)}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      <button
        className={`btn btn-primary ${className}`}
        onClick={() => setShowSettings(true)}>
        <FontAwesomeIcon icon={faCog} />
      </button>

      <button
        disabled={storyDetails.chapterCount <= chapterIndex}
        className={`btn btn-primary ${className}`}
        onClick={() =>
          storyDetails.chapterCount > chapterIndex &&
          navigate(
            `/story/${storyDetails.id}/chapter/${parseInt(chapterIndex) + 1}`,
          )
        }>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </>
  )
}
export default ChapterNavigation
