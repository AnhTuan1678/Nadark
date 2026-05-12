const path = require('path')

module.exports = {
  TEMP_DIR: path.join(process.cwd(), 'temp'),
  PUBLIC_DIR: path.join(process.cwd(), 'public'),
  CLIENT_BUILD_DIR: path.join(process.cwd(), 'dist')
}