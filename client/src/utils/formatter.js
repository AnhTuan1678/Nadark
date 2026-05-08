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
    genres: (book.Genres || []).map((g) => g.name),
    publishedDate: book.createdAt,
    updateAt: book.updatedAt,
    reviewCount: book.review_count,
    totalRating: book.total_rating,
    chapters: book.Chapters || [],
    todayViews: book.today_views,
    weekViews: book.week_views,
    monthViews: book.month_views,
  }
}

export const formatterProfile = (profile) => {
  if (!profile) return null

  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    avatarUrl: profile.avatar_url,
    personalSettings: profile.personal_settings || {},
    createdDate: profile.createdAt
      ? new Date(profile.createdAt).toISOString().split('T')[0]
      : null,
    updatedDate: profile.updatedAt
      ? new Date(profile.updatedAt).toISOString().split('T')[0]
      : null,
  }
}
