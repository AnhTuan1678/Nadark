import { useRef, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Cropper from 'react-easy-crop'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

import styles from './Profile.module.css'
import defaultAvatar from '../../assets/image/default-avatar.png'

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()

    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))

    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], 'avatar.jpg', {
        type: 'image/jpeg',
      })

      resolve(file)
    }, 'image/jpeg')
  })
}

const ProfileHeader = ({ profile, onFileSelected }) => {
  const user = useSelector((state) => state.user)

  const fileInputRef = useRef(null)

  const [showCropModal, setShowCropModal] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const handleAvatarClick = () => {
    if (user.id === profile.id) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    const imageDataUrl = URL.createObjectURL(file)

    setImageSrc(imageDataUrl)
    setShowCropModal(true)
  }

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleSave = async () => {
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels)

      if (onFileSelected) {
        onFileSelected(croppedFile)
      }

      setShowCropModal(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className='position-relative mb-5'>
        <div className={styles.background}>Background</div>

        <div className={styles.profileBox}>
          <div
            className={`position-relative rounded-circle border border-dark overflow-hidden ${styles.avatar}`}>
            <img
              src={profile?.avatarUrl || defaultAvatar}
              alt='avatar'
              className={styles.avatarImage}
            />

            {user.id === profile.id && (
              <div
                className={`btn position-absolute bottom-0 start-0 w-100 ${styles.cusBtn}`}
                onClick={handleAvatarClick}>
                <FontAwesomeIcon icon={faFolder} />
              </div>
            )}

            <input
              type='file'
              ref={fileInputRef}
              className={styles.hiddenInput}
              accept='image/*'
              onChange={handleFileChange}
            />
          </div>

          <h4 className='mt-2'>{profile?.username}</h4>
        </div>
      </div>

      {showCropModal && (
        <div className='cus-overlay'>
          <div className={styles.cropModal}>
            <div className={styles.cropContainer}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className='mt-3'>
              <input
                type='range'
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className='w-100'
              />
            </div>

            <div className='d-flex justify-content-end gap-2 mt-3'>
              <button
                className='btn btn-secondary'
                onClick={() => setShowCropModal(false)}>
                Cancel
              </button>

              <button className='btn btn-primary' onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileHeader
