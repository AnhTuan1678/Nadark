const API_URL = 'https://api.example.com'

// Giả dữ liệu mẫu
const getStoryDetails = async (storyId) => {
  // Đợi 300ms
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    id: storyId,
    title: 'Sample Story',
    urlAvatar:
      'https://p6-novel.byteimg.com/novel-pic/p2o37825e1ebc684e7b9d28ef1ad077c9b9~tplv-shrink:640:0.image',
    summary: 'This is a sample story summary.',
    like: 120,
    views: 4500,
    author: 'John Doe',
    publishedDate: '2023-01-01',
    status: 'Tạm ngưng',
    followers: 300,
    genres: [
      'Fantasy',
      'Adventure',
      'Action',
      'Drama',
      'Romance',
      'Comedy',
      'Horror',
      'Sci-fi',
      'Mystery',
      'Thriller',
      'Historical',
      'Slice of Life',
      'Supernatural',
      'Psychological',
      'Crime',
      'War',
      'Sports',
      'Music',
      'Magical Realism',
      'Dystopian',
      'Post-Apocalyptic',
      'Steampunk',
      'Cyberpunk',
      'Urban',
      'Western',
      'Mythology',
      'Philosophical',
      'Satire',
      'Parody',
      'Epic',
      'Tragedy',
      'Bildungsroman',
    ],
  }
}

const getChapters = async (storyId) => {
  console.log('Fetching chapters for story ID:', storyId)
  // Đợi 300ms
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    { chapterId: 1, index: 1, title: 'Chapter 1', releaseDate: '2023-01-02' },
    { chapterId: 2, index: 2, title: 'Chapter 2', releaseDate: '2023-01-03' },
    { chapterId: 3, index: 3, title: 'Chapter 3', releaseDate: '2023-01-04' },
    { chapterId: 4, index: 4, title: 'Chapter 4', releaseDate: '2023-01-05' },
    { chapterId: 5, index: 5, title: 'Chapter 5', releaseDate: '2023-01-06' },
    { chapterId: 6, index: 6, title: 'Chapter 6', releaseDate: '2023-01-07' },
    { chapterId: 7, index: 7, title: 'Chapter 7', releaseDate: '2023-01-08' },
    { chapterId: 8, index: 8, title: 'Chapter 8', releaseDate: '2023-01-09' },
    { chapterId: 9, index: 9, title: 'Chapter 9', releaseDate: '2023-01-10' },
    {
      chapterId: 10,
      index: 10,
      title: 'Chapter 10',
      releaseDate: '2023-01-11',
    },
    {
      chapterId: 11,
      index: 11,
      title: 'Chapter 11',
      releaseDate: '2023-01-12',
    },
    {
      chapterId: 12,
      index: 12,
      title: 'Chapter 1adddarrrrrrrrrrrrrràddddddddddddddddddddddddrrrrrrrrrrq2',
      releaseDate: '2023-01-13',
    },
    {
      chapterId: 13,
      index: 13,
      title: 'Chapter 13',
      releaseDate: '2023-01-14',
    },
    {
      chapterId: 14,
      index: 14,
      title: 'Chapter 14',
      releaseDate: '2023-01-15',
    },
    {
      chapterId: 15,
      index: 15,
      title: 'Chapter 15',
      releaseDate: '2023-01-16',
    },
    {
      chapterId: 16,
      index: 16,
      title: 'Chapter 16',
      releaseDate: '2023-01-17',
    },
    {
      chapterId: 17,
      index: 17,
      title: 'Chapter 17',
      releaseDate: '2023-01-18',
    },
    {
      chapterId: 18,
      index: 18,
      title: 'Chapter 18',
      releaseDate: '2023-01-19',
    },
    {
      chapterId: 19,
      index: 19,
      title: 'Chapter 19',
      releaseDate: '2023-01-20',
    },
    {
      chapterId: 20,
      index: 20,
      title: 'Chapter 20',
      releaseDate: '2023-01-21',
    },
  ]
}

export { API_URL, getStoryDetails, getChapters }
