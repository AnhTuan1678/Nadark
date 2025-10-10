const sequelize = require('../config/database')
const { Sequelize } = require('sequelize')
const User = require('./User')
const Book = require('./Book')
const BookTraffic = require('./BookTraffic')
const Chapter = require('./Chapter')
const Comment = require('./Comment')
const Genre = require('./Genre')
const Review = require('./Review')
const UserBookshelf = require('./UserBookshelf')
const UserProgress = require('./UserProgress')

// --- User ↔ Book ---
Book.belongsTo(User, { foreignKey: 'uploader_id', as: 'uploader' })
User.hasMany(Book, { foreignKey: 'uploader_id', as: 'books' })

// --- Book ↔ Genre ---
Book.belongsToMany(Genre, { through: 'book_genres', foreignKey: 'bookId' })
Genre.belongsToMany(Book, { through: 'book_genres', foreignKey: 'genreId' })

// --- Book ↔ Chapter ---
Book.hasMany(Chapter, { foreignKey: 'book_id', onDelete: 'CASCADE' })
Chapter.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE' })

// --- Book ↔ BookTraffic ---
Book.hasMany(BookTraffic, { foreignKey: 'book_id', as: 'traffic' })
BookTraffic.belongsTo(Book, { foreignKey: 'book_id', as: 'book' })

// --- User ↔ Review ---
Review.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Review, { foreignKey: 'user_id' })

// --- Book ↔ Review ---
Review.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE' })
Book.hasMany(Review, { foreignKey: 'book_id', onDelete: 'CASCADE' })

// --- User ↔ Comment ---
Comment.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Comment, { foreignKey: 'user_id' })

// --- Chapter ↔ Comment ---
Comment.belongsTo(Chapter, { foreignKey: 'chapter_id', onDelete: 'CASCADE' })
Chapter.hasMany(Comment, { foreignKey: 'chapter_id' })

// --- Comment tự tham chiếu (comment lồng nhau) ---
Comment.belongsTo(Comment, { as: 'Parent', foreignKey: 'parent_id' })
Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'parent_id' })

// --- User ↔ Bookshelf ---
UserBookshelf.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' })
UserBookshelf.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE' })
User.hasMany(UserBookshelf, { foreignKey: 'user_id' })
Book.hasMany(UserBookshelf, { foreignKey: 'book_id' })

// --- User ↔ Progress ---
UserProgress.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' })
UserProgress.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE' })
User.hasMany(UserProgress, { foreignKey: 'user_id' })
Book.hasMany(UserProgress, { foreignKey: 'book_id' })

const db = {
  sequelize,
  Sequelize,
  User,
  Book,
  BookTraffic,
  Chapter,
  Comment,
  Genre,
  Review,
  UserBookshelf,
  UserProgress,
}

module.exports = db
