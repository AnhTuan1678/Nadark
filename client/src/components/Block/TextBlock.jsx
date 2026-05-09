import React from 'react'

const TextBlock = ({ block, index, updateBlock, deleteBlock }) => {
  return (
    <div className='mb-3 position-relative p-2 border rounded'>
      <button
        type='button'
        className='btn btn-sm btn-danger position-absolute'
        style={{ top: 5, right: 5 }}
        onClick={() => deleteBlock(index)}>
        ✕
      </button>

      <textarea
        className='form-control'
        rows={10}
        value={block.content}
        onChange={(e) => updateBlock(index, { content: e.target.value })}
      />
    </div>
  )
}

export default TextBlock
