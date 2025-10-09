import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

const StoryChaptersSection = ({
  storyDetails,
  chapters,
  progress,
}) => {
  const [showAll, setShowAll] = useState(false)
  const navigate = useNavigate()
  const visibleDefault = 30

  const ChapterItem = ({ chapter }) => {
    let classNames = `p-1 rounded ${styles.chapterItem} `
    if (progress) {
      if (chapter.index < progress.last_chapter_index)
        classNames += styles.readChapter
      else if (chapter.index === progress.last_chapter_index)
        classNames += styles.currentChapter
    }

    return (
      <div
        className={classNames}
        onClick={() =>
          navigate(`/story/${storyDetails.id}/chapter/${chapter.index}`)
        }>
        Chương {chapter.index}: {chapter.title}
      </div>
    )
  }

  return (
    <div className='mb-4'>
      <h3>Danh sách chương</h3>
      <div className='position-relative'>
        <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3 mb-3'>
          {chapters.map((chapter, index) => (
            <div
              key={chapter.chapterId}
              className={`col ${
                visibleDefault > index || showAll ? '' : 'd-none'
              }`}>
              <ChapterItem chapter={chapter} />
            </div>
          ))}
        </div>
        {visibleDefault < chapters.length && !showAll && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4rem',
              background:
                'linear-gradient(180deg, rgba(var(--color-container-background-rgb), 0) 0%, rgba(var(--color-container-background-rgb), 0.75) 75%, rgba(var(--color-container-background-rgb), 1) 100%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {visibleDefault < chapters.length && !showAll && (
        <div className='text-center w-100'>
          <div
            className='btn opacity-hover-50'
            onClick={() => setShowAll(true)}>
            Xem thêm
          </div>
        </div>
      )}
    </div>
  )
}

export default StoryChaptersSection
