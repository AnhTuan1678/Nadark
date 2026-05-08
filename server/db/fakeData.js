const db = require('../src/models/index')
const { faker } = require('@faker-js/faker')
const bcrypt = require('bcrypt')

faker.locale = 'vi'

async function seedUsers(number = 100) {
  try {
    const users = []

    // Hash trước để tái sử dụng (tất cả mật khẩu "1")
    const passwordHash = await bcrypt.hash('1', 10)

    for (let i = 0; i < number; i++) {
      users.push({
        username: faker.internet.username().toLowerCase(), // ✅ username
        email: faker.internet.email().toLowerCase(),
        password_hash: passwordHash,
        avatar_url: faker.image.avatarGitHub(), // ✅ thay avatar
        personal_settings: {},
        createdAt: faker.date.past({ years: 2 }),
        updatedAt: new Date(),
      })
    }

    await db.User.bulkCreate(users)
    console.log(`✅ Đã tạo ${number} user fake (mật khẩu là "1")`)
  } catch (err) {
    console.error(err)
  }
}

async function seedBooksAndChapters(b_num, c_min_num, c_max_num) {
  try {
    console.log('⏳ Bắt đầu seed Books & Chapters...')

    const booksData = []
    const totalBooks = b_num

    // 1) Tạo Book
    for (let i = 0; i < totalBooks; i++) {
      booksData.push({
        title: faker.lorem.words(3),
        author: faker.person.fullName(),
        description: faker.lorem.paragraphs(2),
        genre: faker.helpers.arrayElement([
          'Tiên hiệp',
          'Kiếm hiệp',
          'Huyền huyễn',
          'Ngôn tình',
          'Trinh thám',
        ]),
        url_avatar: faker.image.urlPicsumPhotos({ width: 300, height: 450 }),
        chapter_count: 0,
        word_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    const books = await db.Book.bulkCreate(booksData, { returning: true })
    console.log(`✔ Đã tạo ${books.length} Book`)

    // 2) Tạo Chapter cho từng Book
    for (const book of books) {
      const numChapters = faker.number.int({ min: c_min_num, max: c_max_num })
      const chapters = []

      for (let i = 1; i <= numChapters; i++) {
        const content = faker.lorem.paragraphs(
          faker.number.int({ min: 30, max: 300 }),
        )
        chapters.push({
          book_id: book.id,
          index: i,
          title: `Chương ${i}: ${faker.lorem.words(4)}`,
          author_note: faker.datatype.boolean() ? faker.lorem.sentence() : null,
          content,
          image_url: faker.image.urlPicsumPhotos({ width: 640, height: 360 }),
          word_count: content.trim().split(/\s+/).length,
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: new Date(),
        })
      }

      await db.Chapter.bulkCreate(chapters)
      console.log(`   → Book [${book.id}] đã tạo ${numChapters} chương`)
    }

    console.log('🎉 Hoàn tất seed Books & Chapters!')
  } catch (err) {
    console.error('❌ Lỗi khi seed:', err)
  }
}

async function seedReviews(number = 1000) {
  try {
    const users = await db.User.findAll({ attributes: ['id'] })
    const books = await db.Book.findAll({ attributes: ['id'] })

    if (users.length === 0 || books.length === 0) {
      console.log('⚠️ Cần có user và book trước khi tạo review')
      return
    }

    const reviews = []
    const usedPairs = new Set() // để tránh trùng

    let attempts = 0
    while (reviews.length < number && attempts < number * 3) {
      attempts++

      const user = faker.helpers.arrayElement(users)
      const book = faker.helpers.arrayElement(books)
      const key = `${user.id}-${book.id}`

      if (usedPairs.has(key)) continue // đã có review cho cặp này thì bỏ qua
      usedPairs.add(key)

      reviews.push({
        user_id: user.id,
        book_id: book.id,
        content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
        rating: faker.number.int({ min: 1, max: 5 }),
        createdAt: faker.date.past({ years: 2 }),
        updatedAt: new Date(),
      })
    }

    await db.Review.bulkCreate(reviews)
    console.log(`✅ Đã tạo ${reviews.length} review (unique per user-book)`)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Chunk helper
 */
function chunkArray(arr, size) {
  const res = []
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size))
  }
  return res
}

async function seedCommentsTwoStep({
  total = 150000,
  batchSize = 5000,
  replyRatio = 0.2,
} = {}) {
  try {
    console.log('⏳ Bắt đầu seed comments (2 bước)...')

    // 1) load users + chapters
    const users = await db.User.findAll({ attributes: ['id'], raw: true })
    const chapters = await db.Chapter.findAll({ attributes: ['id'], raw: true })

    if (!users.length || !chapters.length) {
      console.error(
        '⚠️ Cần có users và chapters trong DB trước khi seed comments.',
      )
      return
    }

    console.log(`Users: ${users.length}, Chapters: ${chapters.length}`)

    // 2) Tạo comment (không có parent_id) theo batch và lưu kết quả trả về (có id)
    const createdComments = [] // sẽ chứa { id, chapter_id }
    let buffer = []
    let createdCount = 0

    for (let i = 0; i < total; i++) {
      const user = faker.helpers.arrayElement(users)
      const chapter = faker.helpers.arrayElement(chapters)

      buffer.push({
        user_id: user.id,
        chapter_id: chapter.id,
        parent_id: null,
        content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: new Date(),
      })

      if (buffer.length >= batchSize || i === total - 1) {
        // bulk insert batch
        const inserted = await db.Comment.bulkCreate(buffer, {
          returning: true,
        })
        // lưu id + chapter_id
        inserted.forEach((it) => {
          // it có thể là instance Sequelize
          createdComments.push({ id: it.id, chapter_id: it.chapter_id })
        })
        createdCount += inserted.length
        console.log(`✔ Inserted ${createdCount}/${total} comments`)
        buffer = []
      }
    }

    // 3) Build map chapter_id -> [ids] để chọn parent cùng chương
    const mapByChapter = new Map()
    createdComments.forEach((c) => {
      const arr = mapByChapter.get(c.chapter_id) || []
      arr.push(c.id)
      mapByChapter.set(c.chapter_id, arr)
    })

    // 4) Chọn một số comment làm reply (child) và gán parent_id hợp lệ (cùng chapter)
    const updates = [] // mảng { id: childId, parent_id: parentId }
    for (const c of createdComments) {
      if (Math.random() < replyRatio) {
        const pool = mapByChapter.get(c.chapter_id) || []
        if (pool.length <= 1) continue // không có parent khác cùng chapter
        // chọn parent khác chính nó
        let parentId = c.id
        let attempts = 0
        while (parentId === c.id && attempts < 5) {
          parentId = faker.helpers.arrayElement(pool)
          attempts++
        }
        if (parentId !== c.id) {
          updates.push({ id: c.id, parent_id: parentId })
        }
      }
    }

    console.log(
      `🔁 Sẽ cập nhật parent_id cho ${updates.length} comment (reply)`,
    )

    // 5) Cập nhật parent_id theo batch để tránh quá tải
    const updateBatchSize = 1000
    const updateChunks = chunkArray(updates, updateBatchSize)
    let updatedCount = 0
    for (const chunk of updateChunks) {
      // thực hiện đồng thời trong chunk (tùy DB/infra, bạn có thể giảm concurrency)
      await Promise.all(
        chunk.map((u) =>
          db.Comment.update(
            { parent_id: u.parent_id },
            {
              where: { id: u.id },
            },
          ),
        ),
      )
      updatedCount += chunk.length
      console.log(`✔ Updated parent_id: ${updatedCount}/${updates.length}`)
    }

    console.log('🎉 Hoàn tất seed comments 2 bước!')
    console.log(
      `Total inserted: ${createdComments.length}, total replies set: ${updatedCount}`,
    )
  } catch (err) {
    console.error('❌ Lỗi khi seed comments:', err)
  }
}

async function seedUserBookshelf(max) {
  try {
    console.log('⏳ Bắt đầu seed UserBookshelf...')

    const users = await db.User.findAll({ attributes: ['id'], raw: true })
    const books = await db.Book.findAll({ attributes: ['id'], raw: true })

    if (!users.length || !books.length) {
      console.log('⚠️ Cần có user và book trước khi tạo UserBookshelf')
      return
    }

    const data = []

    for (const user of users) {
      // số sách mỗi user sẽ lưu vào tủ
      const numBooks = faker.number.int({ min: 0, max })
      const chosenBooks = faker.helpers.shuffle(books).slice(0, numBooks)

      chosenBooks.forEach((book) => {
        data.push({
          user_id: user.id,
          book_id: book.id,
          saved_at: faker.date.past({ years: 1 }),
        })
      })
    }

    await db.UserBookshelf.bulkCreate(data)
    console.log(`✔ Đã tạo ${data.length} UserBookshelf!`)
  } catch (err) {
    console.error('❌ Lỗi khi seed:', err)
  }
}

async function seedUserProgress(min, max) {
  try {
    console.log('⏳ Bắt đầu seed UserProgress...')

    const users = await db.User.findAll({ attributes: ['id'], raw: true })
    const books = await db.Book.findAll({
      attributes: ['id', 'chapter_count'],
      raw: true,
    })

    if (!users.length || !books.length) {
      console.log('⚠️ Cần có user và book trước khi tạo UserProgress')
      return
    }

    const data = []

    for (const user of users) {
      // số sách mỗi user sẽ đọc
      const numBooks = faker.number.int({ min, max })
      const chosenBooks = faker.helpers.shuffle(books).slice(0, numBooks)

      chosenBooks.forEach((book) => {
        let lastIndex = 0
        let progress = 0

        if (book.chapter_count > 0) {
          lastIndex = faker.number.int({
            min: 1,
            max: book.chapter_count,
          })
          progress = ((lastIndex / book.chapter_count) * 100).toFixed(2)
        }

        data.push({
          user_id: user.id,
          book_id: book.id,
          last_chapter_index: lastIndex,
          progress_percent: progress,
          updatedAt: faker.date.recent({ days: 180 }),
        })
      })
    }

    await db.UserProgress.bulkCreate(data)
    console.log(`✔ Đã tạo ${data.length} UserProgress!`)
  } catch (err) {
    console.error('❌ Lỗi khi seed:', err)
  }
}

async function recalculateBookMeta() {
  console.log('⏳ Đang cập nhật lại meta cho Book...')

  // Followers = số user có trong UserBookshelf
  const followers = await db.UserBookshelf.findAll({
    attributes: [
      'book_id',
      [db.sequelize.fn('COUNT', db.sequelize.col('user_id')), 'followers'],
    ],
    group: ['book_id'],
    raw: true,
  })

  // Reviews: count + total rating
  const reviews = await db.Review.findAll({
    attributes: [
      'book_id',
      [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'review_count'],
      [db.sequelize.fn('SUM', db.sequelize.col('rating')), 'total_rating'],
    ],
    group: ['book_id'],
    raw: true,
  })

  // Chapters: count + words
  const chapters = await db.Chapter.findAll({
    attributes: [
      'book_id',
      [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'chapter_count'],
      [db.sequelize.fn('SUM', db.sequelize.col('word_count')), 'word_count'],
    ],
    group: ['book_id'],
    raw: true,
  })

  // Gom dữ liệu vào map
  const map = {}

  ;[followers, reviews, chapters].forEach((rows) => {
    rows.forEach((r) => {
      if (!map[r.book_id]) map[r.book_id] = {}
      Object.assign(map[r.book_id], r)
    })
  })

  // Update từng Book
  for (const [bookId, values] of Object.entries(map)) {
    await db.Book.update(
      {
        followers: values.followers || 0,
        review_count: values.review_count || 0,
        total_rating: values.total_rating || 0,
        chapter_count: values.chapter_count || 0,
        word_count: values.word_count || 0,
      },
      { where: { id: bookId } },
    )
  }

  console.log(`✔ Đã cập nhật meta cho ${Object.keys(map).length} Book`)
}

;(async () => {
  await seedUsers(100)
  await seedBooksAndChapters(60, 10, 1000)
  await seedReviews(1000)
  await seedCommentsTwoStep({ total: 150000, batchSize: 5000, replyRatio: 0.2 })
    .then(() => console.log('Script finished'))
    .catch((e) => console.error(e))
  await seedUserBookshelf(30)
  await seedUserProgress(5, 40)
  console.log('🎉 Seed script finished!')
  await recalculateBookMeta()
  await db.sequelize.close()
})()
