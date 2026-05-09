import React from 'react'

const ImageBlock = ({ block, index, updateBlock, deleteBlock }) => {
  return (
    <div className='mb-3 position-relative p-2 border rounded'>
      <button
        type='button'
        className='btn btn-sm btn-danger position-absolute'
        style={{ top: 5, right: 5 }}
        onClick={() => deleteBlock(index)}>
        ✕
      </button>

      <div className='d-flex gap-3 mb-2'>
        <label>
          <input
            type='radio'
            checked={block.mode === 'url'}
            onChange={() => updateBlock(index, { mode: 'url', file: null })}
          />{' '}
          URL
        </label>

        <label>
          <input
            type='radio'
            checked={block.mode === 'file'}
            onChange={() => updateBlock(index, { mode: 'file', url: '' })}
          />{' '}
          Upload
        </label>
      </div>

      {block.mode === 'url' && (
        <input
          className='form-control'
          value={block.url}
          onChange={(e) => updateBlock(index, { url: e.target.value })}
        />
      )}

      {block.mode === 'file' && (
        <input
          type='file'
          className='form-control'
          accept='image/*'
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return

            updateBlock(index, {
              file,
              url: URL.createObjectURL(file),
            })
          }}
        />
      )}

      {block.url && (
        <div className='mt-2 text-center'>
          <img
            src={block.url}
            alt='preview'
            style={{
              maxWidth: 'calc(100% - 100px)',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ImageBlock
