# 📚 NaDark — Website Đọc Truyện Trực Tuyến

<div align="center">

![NaDark Banner](https://img.shields.io/badge/NaDark-Đọc%20Truyện%20Online-6c63ff?style=for-the-badge&logo=bookstack&logoColor=white)

[![Demo](https://img.shields.io/badge/🌐%20Live%20Demo-nadark.onrender.com-6c63ff?style=flat-square)](https://nadark.onrender.com/)
[![GitHub](https://img.shields.io/badge/GitHub-AnhTuan1678%2FNadark-181717?style=flat-square&logo=github)](https://github.com/AnhTuan1678/Nadark)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-ExpressJS-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

</div>

---

## 📖 Giới thiệu

**NaDark** là một dự án cá nhân xây dựng website đọc truyện trực tuyến hoàn chỉnh với đầy đủ tính năng. Dự án được phát triển nhằm cung cấp trải nghiệm đọc truyện mượt mà, thân thiện với người dùng trên cả máy tính lẫn thiết bị di động.

🌐 **Demo trực tiếp:** [https://nadark.onrender.com/](https://nadark.onrender.com/)

---

## ✨ Tính năng chính

### 📚 Quản lý nội dung (CRUD)
- Quản lý đầy đủ: **người dùng**, **truyện**, **chương truyện**, **bình luận** và **đánh giá**
- Hệ thống phân loại truyện theo **thể loại (genre)**, trạng thái và tác giả
- Trang chi tiết truyện với thông tin đầy đủ và thống kê lượt xem

### 🔍 Tìm kiếm
- Tìm kiếm truyện theo **tên** và **tác giả**
- Lọc truyện theo nhiều tiêu chí: thể loại, trạng thái, lượt xem

### 🎧 Đọc truyện bằng giọng nói
- Hỗ trợ **Text-to-Speech** sử dụng giọng đọc local của trình duyệt
- Điều chỉnh tốc độ đọc, giọng đọc theo sở thích

### 📥 Tải truyện offline
- Tải các chương truyện về máy để **đọc offline** không cần kết nối internet
- Sử dụng **Dexie (IndexedDB)** để lưu trữ dữ liệu cục bộ

### 📱 Giao diện Responsive
- Tương thích với nhiều kích thước màn hình: desktop, tablet, mobile
- Giao diện hiện đại, tối ưu trải nghiệm đọc

### 🌓 Chế độ sáng / tối (Light / Dark Mode)
- Chuyển đổi giao diện sáng/tối dễ dàng
- Lưu lại tùy chọn của người dùng

### 🔔 Thông báo
- Hệ thống thông báo cho các hoạt động tương tác trên nền tảng

### 📖 Tủ sách & Tiến độ đọc
- Lưu truyện vào **tủ sách cá nhân**
- Theo dõi **tiến độ đọc** — ghi nhớ chương đang đọc dở

### 💬 Bình luận lồng nhau
- Bình luận từng chương truyện
- Hỗ trợ **reply** (trả lời bình luận) nhiều cấp

### ⭐ Đánh giá & Review
- Đánh giá truyện bằng sao (rating)
- Viết review chi tiết cho từng tác phẩm

---

## 🛠️ Công nghệ sử dụng

### Front-end
| Công nghệ | Mô tả |
|---|---|
| **React 19** | Thư viện UI chính |
| **Redux Toolkit** | Quản lý state toàn cục |
| **React Router DOM v7** | Điều hướng phía client |
| **Bootstrap 5** + React-Bootstrap | Giao diện và layout |
| **Vite** | Build tool & dev server |
| **Dexie (IndexedDB)** | Lưu trữ offline |
| **Tippy.js** | Tooltip/Popover |
| **Font Awesome** | Icon library |

### Back-end
| Công nghệ | Mô tả |
|---|---|
| **Node.js** | Runtime môi trường |
| **Express.js v5** | Web framework |
| **JWT (jsonwebtoken)** | Xác thực người dùng |
| **Sequelize ORM** | ORM tương tác với database |
| **Multer** | Upload file/ảnh |
| **Sharp** | Xử lý & tối ưu hình ảnh |
| **Bcrypt** | Mã hóa mật khẩu |

### Database & Infrastructure
| Công nghệ | Mô tả |
|---|---|
| **PostgreSQL** | Hệ quản trị cơ sở dữ liệu |
| **Neon** (tùy chọn) | PostgreSQL serverless trên cloud |

---

## 🗂️ Cấu trúc dự án

```
Nadark/
├── client/                  # Front-end (React + Vite)
│   ├── src/
│   │   ├── components/      # Các component dùng chung
│   │   ├── pages/           # Các trang: Home, Reader, Profile, Manager...
│   │   ├── redux/           # Redux store & slices
│   │   ├── services/        # Gọi API
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # React Context
│   │   ├── layout/          # Layout chính
│   │   └── utils/           # Tiện ích
│   ├── .env                 # Biến môi trường client
│   └── package.json
│
└── server/                  # Back-end (Node.js + Express)
    ├── src/
    │   ├── config/          # Cấu hình database
    │   ├── controllers/     # Xử lý logic request
    │   ├── models/          # Định nghĩa model Sequelize
    │   │   ├── User.js
    │   │   ├── Book.js
    │   │   ├── Chapter.js
    │   │   ├── Comment.js
    │   │   ├── Review.js
    │   │   ├── Genre.js
    │   │   ├── BookTraffic.js
    │   │   ├── UserBookshelf.js
    │   │   └── UserProgress.js
    │   ├── modules/         # Module: assets, notifications
    │   ├── middleware/      # Auth middleware, ...
    │   ├── route/           # Định nghĩa API routes
    │   ├── services/        # Business logic
    │   └── utils/           # Helper functions
    ├── .env                 # Biến môi trường server
    └── package.json
```

---

## ⚙️ Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x (cài đặt cục bộ hoặc dùng cloud như Neon)

---

### 1. Clone repository

```bash
git clone https://github.com/AnhTuan1678/Nadark.git
cd Nadark
```

---

### 2. Cài đặt Back-end (Server)

```bash
cd server
npm install
```

#### Cấu hình biến môi trường Server

Tạo file `.env` trong thư mục `server/`:

```env
HOST=0.0.0.0
PORT=3000

# Cấu hình PostgreSQL (Local)
DB_NAME=NaDark
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_SSL=false

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

> **Nếu dùng PostgreSQL trên Neon (cloud):**
> ```env
> DB_HOST=ep-xxxx.ap-southeast-1.aws.neon.tech
> DB_NAME=neondb
> DB_USER=neondb_owner
> DB_PASSWORD=your_neon_password
> DB_PORT=5432
> DB_SSL=true
> ```

#### Tạo database

Đảm bảo PostgreSQL đang chạy, sau đó tạo database:

```sql
CREATE DATABASE "NaDark";
```

Sequelize sẽ tự động đồng bộ và tạo các bảng khi server khởi động lần đầu.

#### Chạy Server

```bash
# Chế độ development (hot-reload với nodemon)
npm run dev

# Chế độ production
npm start
```

✅ Server sẽ chạy tại: `http://localhost:3000`

---

### 3. Cài đặt Front-end (Client)

Mở một terminal mới:

```bash
cd client
npm install
```

#### Cấu hình biến môi trường Client

Tạo file `.env` trong thư mục `client/`:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=NaDark
```

> **Lưu ý:** Thay `localhost` bằng địa chỉ IP thực nếu bạn chạy server trên máy khác trong mạng LAN (ví dụ: `http://192.168.2.199:3000`).

#### Chạy Client

```bash
# Chế độ development
npm run dev
```

✅ Client sẽ chạy tại: `http://localhost:5173`

---

### 4. Build & Chạy Production

> Khi deploy hoặc chạy production, **chỉ cần build client một lần**, sau đó **chỉ chạy server** là đủ — Express tự phục vụ toàn bộ frontend.

**Bước 1:** Build client (từ thư mục `client/`)

```bash
npm run build
```

Vite tự động output kết quả build vào **`server/dist/`** (cấu hình sẵn trong `vite.config.js`).

**Bước 2:** Chạy server (từ thư mục `server/`)

```bash
npm start
```

Express serve toàn bộ frontend từ `server/dist/` và xử lý API tại `/api`. Truy cập tại `http://localhost:3000`.

---

### 5. Tóm tắt lệnh

| Thư mục | Lệnh | Mô tả |
|---|---|---|
| `server/` | `npm run dev` | Chạy server development (nodemon) |
| `server/` | `npm start` | Chạy server production (bao gồm cả frontend) |
| `client/` | `npm run dev` | Chạy client development (Vite) |
| `client/` | `npm run build` | Build client → output vào `server/dist/` |

---

## 🗄️ Mô hình cơ sở dữ liệu

```
User ──< Book ──< Chapter ──< Comment (lồng nhau / reply)
              │
              ├──< Review           (đánh giá truyện)
              ├──< BookTraffic      (thống kê lượt xem theo ngày)
              ├──< UserBookshelf    (tủ sách cá nhân)
              └──< UserProgress     (tiến độ đọc)

User     ──< Notification
Genre >──< Book  (quan hệ nhiều-nhiều qua bảng book_genres)
```

---

## 🚀 Deploy

Dự án hiện được deploy tại:

- **Frontend + Backend:** [https://nadark.onrender.com/](https://nadark.onrender.com/) — Render.com
- **Database:** PostgreSQL — Neon (serverless)

---

## 📄 License

Dự án này được phát triển cho mục đích **học tập và cá nhân**.

---

<div align="center">

Made with ❤️ by **AnhTuan1678**

[![GitHub](https://img.shields.io/badge/GitHub-AnhTuan1678-181717?style=flat-square&logo=github)](https://github.com/AnhTuan1678/Nadark)

</div>