import { useState } from 'react'
import { buildCommentTree } from '../../utils/buildCommentTree'
import { CommentBox } from '../../components/CommentBox'
import { useSelector } from 'react-redux'
import { timeAgo } from '../../utils/timeAgo'
import { faComment, faTrash } from '@fortawesome/free-solid-svg-icons'
import { CommentItem } from '../../components/CommentItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CommentSection = ({
  comments,
  handleSendComment,
  handleDeleteComment,
}) => {
  const [replyTo, setReplyTo] = useState(null)

  return (
    <div className='cus-container d-flex flex-column mb-4 p-4 border rounded'>
      <div className='mb-4'>
        <h3>Bình luận</h3>
        <CommentBox
          onSend={(mess) => {
            handleSendComment(mess)
            setReplyTo(null)
          }}
          focus={false}
        />
      </div>

      {buildCommentTree(comments).map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment}
          replyTo={replyTo}
          setReplyTo={setReplyTo}
          handleSendComment={handleSendComment}
          handleDeleteComment={handleDeleteComment}
        />
      ))}
    </div>
  )
}

const CommentNode = ({
  comment,
  replyTo,
  setReplyTo,
  handleSendComment,
  handleDeleteComment,
}) => {
  const user = useSelector((state) => state.user)

  const handleReplyClick = () => setReplyTo(comment.id)

  return (
    <div className='p-0 mb-2'>
      <CommentItem comment={comment} />

      <div className='d-flex flex-row align-items-center ms-5'>
        <h6 className='me-3 ms-2'>{timeAgo(comment.created_at)}</h6>
        <div
          className='btn opacity-hover-50 m-0 p-0 d-flex flex-row me-3'
          onClick={handleReplyClick}>
          <FontAwesomeIcon icon={faComment} />
          <p className='p-0 m-0'>Trả lời</p>
        </div>
        {user.id === comment.user_id && (
          <div
            className='btn opacity-hover-50 m-0 p-0 d-flex flex-row text-danger'
            onClick={() => handleDeleteComment(user.token, comment.id)}>
            <FontAwesomeIcon icon={faTrash} />
            <p className='p-0 m-0'>Xoá</p>
          </div>
        )}
      </div>

      {replyTo === comment.id && (
        <CommentBox
          defaultContent={`@${comment.User?.username || ''} `}
          onCancel={() => setReplyTo(null)}
          onSend={(mess) => {
            handleSendComment(mess, comment.parent_id ?? comment.id)
            setReplyTo(null)
          }}
        />
      )}

      {comment.replies?.length > 0 && (
        <div className='ms-5'>
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              handleSendComment={handleSendComment}
              handleDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection
