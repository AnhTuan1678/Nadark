export const formatterStoryDetail = (book) => {
  if (!book) return null

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description,
    status: book.status,
    chapterCount: book.chapter_count,
    wordCount: book.word_count,
    like: book.like,
    views: book.views,
    followers: book.followers,
    urlAvatar: book.url_avatar,
    genres: book.genres || [],
    publishedDate: book.created_at,
    updatedDate: book.updated_at,
  }
}
