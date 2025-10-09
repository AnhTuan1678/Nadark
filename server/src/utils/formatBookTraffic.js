/**
 * 🧾 Hàm format dữ liệu BookTraffic sang dạng phẳng, giữ nguyên toàn bộ thông tin Book
 * @param {Array} data - Dữ liệu trả về từ Sequelize (BookTraffic + Book)
 * @param {string} fieldName - Tên cột hiển thị view ('today_views', 'week_views', 'month_views')
 * @param {string} valueKey - Khóa trong model chứa giá trị ('views' hoặc 'total_views')
 */
function formatBookTraffic(data, fieldName, valueKey) {
  if (!Array.isArray(data)) return []
  console.log(data)

  return data.map((item) => {
    const book = item.book?.toJSON?.() || item.book || {}
    return {
      ...book, // toàn bộ thông tin bảng Book
      [fieldName]: Number(item.getDataValue(valueKey)) || 0,
    }
  })
}

module.exports = { formatBookTraffic }
