import { useNavigate } from 'react-router-dom'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import styles from './StoryCard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faBookmark, faEye } from '@fortawesome/free-solid-svg-icons'

const StoryCard = ({ story, className }) => {
  const navigate = useNavigate()

  const popupContent = (
    <div className={`${styles['story-info-popup']} d-flex flex-column`}>
      <div className='d-flex'>
        <img
          src={story.urlAvatar}
          alt={story.title}
          className={styles['card-img']}
        />
        <div className='d-flex flex-column p-2 ps-3'>
          <h5>{story.title}</h5>
          <p className='fst-italic fs-6'>{story.author}</p>
          <p>{story.chapterCount} chương</p>
          <div>
            <div className={`btn ${styles['cus-btn']}`}>
              <FontAwesomeIcon icon={faHeart} /> {story.like}
            </div>
            <div className={`btn ${styles['cus-btn']}`}>
              <FontAwesomeIcon icon={faBookmark} /> {story.followers}
            </div>
            <div className={`btn ${styles['cus-btn']}`}>
              <FontAwesomeIcon icon={faEye} /> {story.views}
            </div>
          </div>
        </div>
      </div>
      <p>{story.description}</p>
    </div>
  )

  return (
    <div className={`col-4 col-sm-3 col-md-2 p-1 ${className}`}>
      <Tippy
        content={popupContent}
        placement='right'
        interactive={false}
        delay={[100, 0]}
        offset={[50, -90]}
        maxWidth={500}
        arrow={true}
        animation='fade'>
        <div
          className={`card h-100 shadow-sm ${styles['story-card']}`}
          onClick={() => navigate(`/story/${story.id}`)}>
          <div className='card text-white'>
            {story.urlAvatar && (
              <img
                src={story.urlAvatar}
                alt={story.title}
                className='card-img'
                style={{ objectFit: 'cover', height: '200px' }}
              />
            )}

            {story?.chapters?.length === 1 && (
              <div className='card-img-overlay d-flex flex-column justify-content-end p-2 bg-dark bg-opacity-25'>
                <ul className='list-group list-group-flush'>
                  {story.chapters.map((chapter) => (
                    <li
                      key={chapter.id}
                      className={`list-group-item bg-transparent text-white border-0 p-0 ${styles['card-title']}`}>
                      {chapter.index}. {chapter.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={`${styles['card-body']} p-0`}>
            <p
              className={`${styles['card-title']} text-center p-2 m-0 fw-bold`}>
              {story.title}
            </p>
          </div>
        </div>
      </Tippy>
    </div>
  )
}

export default StoryCard
