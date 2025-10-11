import Loading from '../../components/Loading'
import ImageWithFallBack from '../../components/ImageWithFallback'

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
