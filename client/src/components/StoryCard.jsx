import { useNavigate } from 'react-router-dom'
import './styles.css' // import file CSS

const StoryCard = ({ story }) => {
  const navigate = useNavigate()

  return (
    <div className='col-6 col-sm-4 col-md-3 mb-3'>
      <div
        className='card h-100 shadow-sm story-card'
        onClick={() => navigate(`/story/${story.id}`)}>
        {story.urlAvatar && (
          <img
            src={story.urlAvatar}
            alt={story.title}
            className='card-img-top'
            style={{ objectFit: 'cover', height: '200px' }}
          />
        )}
        <div className='card-body'>
          <h5 className='card-title'>{story.title}</h5>
          <p className='card-text text-muted'>
            {story.chapterCount} chương · Xuất bản: {story.publishedDate}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StoryCard
