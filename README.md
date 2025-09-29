# Plant Information Portal

Hệ thống cổng thông tin tra cứu thực vật sử dụng MERN Stack (MongoDB, Express.js, React + Vite, Node.js).

## Tính năng

- 🏠 **Trang chủ**: Banner và tìm kiếm thực vật
- 🔍 **Tra cứu**: Tìm kiếm thông tin chi tiết về thực vật
- 📋 **Quản lý**: CRUD operations cho admin
- 📱 **Responsive**: Giao diện hiện đại, tương thích mọi thiết bị

## Cấu trúc dự án

```
plant-portal/
├── client/          # React + Vite Frontend
├── server/          # Node.js + Express Backend  
├── README.md
└── package.json
```

## Cài đặt và chạy

### 1. Cài đặt dependencies

#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
cd client
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` trong thư mục `server`:
```
MONGODB_URI=mongodb://localhost:27017/plant-portal
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

### 3. Chạy ứng dụng

#### Development mode:

Chạy Backend (Terminal 1):
```bash
cd server
npm run dev
```

Chạy Frontend (Terminal 2):
```bash
cd client
npm run dev
```

#### Production build:
```bash
cd client
npm run build
cd ../server
npm start
```

## API Endpoints

- `GET /api/plants` - Lấy danh sách tất cả thực vật
- `GET /api/plants/search?q=query` - Tìm kiếm thực vật
- `GET /api/plants/:id` - Lấy thông tin chi tiết thực vật
- `POST /api/plants` - Thêm thực vật mới (admin)
- `PUT /api/plants/:id` - Cập nhật thực vật (admin)
- `DELETE /api/plants/:id` - Xóa thực vật (admin)

## Công nghệ sử dụng

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv

## Admin Access

- Username: `admin`
- Password: `123456`

## Dữ liệu mẫu

Hệ thống bao gồm các thực vật mẫu:
1. Hoa Hồng (Rosa)
2. Tre Trúc (Bambusa)  
3. Sen Đá (Echeveria)

## License

MIT