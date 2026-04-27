import { useState, useEffect, useRef } from 'react'

function ImageWithFallback({ urlAvatar, className, defaultUrl = null }) {
  const df = defaultUrl || 'https://docln.net/img/nocover.jpg'
  const [bgUrl, setBgUrl] = useState(df)
  const [shouldLoad, setShouldLoad] = useState(false)
  const ref = useRef(null)

  // reset khi url đổi
  useEffect(() => {
    setBgUrl(df)
    setShouldLoad(false)
  }, [urlAvatar, df])

  useEffect(() => {
    // Nếu chưa có URL ảnh thì hiển thị ảnh mặc định luôn
    if (!urlAvatar) return setBgUrl(df)

    // Tạo observer để lazy load
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.unobserve(entry.target) // an toàn hơn disconnect
          }
        })
      },
      { rootMargin: '100px' }, // bắt đầu load sớm khi còn cách 100px
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [urlAvatar, df])

  useEffect(() => {
    if (!shouldLoad) return

    let isMounted = true

    const testImage = (url, onSuccess, onError) => {
      const img = new Image()
      img.src = url
      img.onload = () => isMounted && onSuccess()
      img.onerror = () => isMounted && onError()
    }

    // Thử ảnh gốc
    testImage(
      urlAvatar,
      () => setBgUrl(urlAvatar),
      () => {
        // Nếu lỗi → thử qua proxy (images.weserv.nl)
        const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(
          urlAvatar.replace(/^https?:\/\//, ''),
        )}`

        testImage(
          proxyUrl,
          () => setBgUrl(proxyUrl),
          () => setBgUrl(df),
        )
      },
    )

    return () => {
      isMounted = false
    }
  }, [shouldLoad, urlAvatar, df])

  return (
    <div
      ref={ref}
      className={`bg-cover bg-center bg-no-repeat w-full h-full ${className}`}
      style={{
        backgroundImage: `url(${bgUrl})`,
        // transition background-image không hoạt động → giữ nguyên nếu anh muốn
      }}
    />
  )
}

export default ImageWithFallback