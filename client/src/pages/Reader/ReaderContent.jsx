import Loading from '../../components/Loading'

const ReaderContent = ({ content, setting }) => {
  if (!content) return <Loading />
  return (
    <>
      {content.content.split('\n').map((line, index) => {
        const imgMatch = line.match(/^\[!img\]\((.+)\)$/)
        if (imgMatch) {
          return (
            <img
              key={index}
              src={imgMatch[1]}
              alt={`image-${index}`}
              className='chapter-img'
            />
          )
        } else if (line.trim() !== '') {
          return (
            <p key={index} style={setting}>
              {line}
            </p>
          )
        }
        return null
      })}
    </>
  )
}
export default ReaderContent
