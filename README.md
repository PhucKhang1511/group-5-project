# 👨‍💻 Dự án Quản lý Người Dùng - Nhóm 5 (Group 5 Project)

## 🎯 Mô tả dự án
Dự án **Quản lý Người Dùng (User Management System)** được phát triển trong môn học **Phát triển phần mềm mã nguồn mở**.  
Ứng dụng cho phép người dùng:
- Thêm, sửa, xóa và xem danh sách người dùng.
- Thực hành kết nối **Frontend (ReactJS)** với **Backend (Node.js + Express)** và **Database (MongoDB Atlas)**.
- Sử dụng **Git & GitHub Workflow** để làm việc nhóm, quản lý version, tạo Pull Request, xử lý xung đột, và merge code.

---

## 🧠 Chức năng chính (CRUD đầy đủ)
| Chức năng | Mô tả |
|------------|-------|
| **GET** | Hiển thị danh sách người dùng từ MongoDB |
| **POST** | Thêm người dùng mới vào cơ sở dữ liệu |
| **PUT** | Cập nhật thông tin người dùng |
| **DELETE** | Xóa người dùng khỏi cơ sở dữ liệu |

---

## ⚙️ Công nghệ sử dụng
| Thành phần | Công nghệ |
|-------------|------------|
| Frontend | ReactJS, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Quản lý mã nguồn | Git, GitHub |
| Công cụ hỗ trợ | Nodemon, CORS, Postman |

---

## 🚀 Hướng dẫn chạy dự án

### 1️⃣ Clone project
```bash
git clone https://github.com/PhucKhang1511/group-5-project.git


# Group 5 Project – MERN

## 1) Tính năng
- JWT Auth (access + refresh)
- Rate limit login
- RBAC (admin/mod/user)
- Upload avatar (Cloudinary)
- Reset password (Forgot → Reset link)
- Logging hoạt động (Mongo collection `logs`)
- Frontend: Redux Toolkit + Protected Routes

## 2) Cấu hình
### Backend `.env`
\`\`\`
PORT=5000
MONGO_URI=mongodb+srv://Nhom5pt:15112004@cluster0.o0kful3.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=secretkey123
CLOUDINARY_CLOUD_NAME=dv2mxc8lq
CLOUDINARY_API_KEY=423657456818781
CLOUDINARY_API_SECRET=Wi_yo7wIuyaqFBcLJUFdi7B0E-I
RESET_TOKEN_SECRET=refreshkey456
FRONTEND_URL=http://localhost:3000
\`\`\`

### Frontend `.env`
\`\`\`
REACT_APP_API_BASE=http://localhost:5000/api
\`\`\`

## 3) Chạy
\`\`\`bash
cd backend && npm i && npm run dev
cd ../frontend && npm i && npm start
\`\`\`

## 4) API chính
- POST `/api/auth/signup`
- POST `/api/auth/login`
- POST `/api/auth/refresh`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`
- GET `/api/auth/profile` (Auth)
- PUT `/api/auth/update` (Auth)
- GET `/api/users` (Auth + admin/mod)
- DELETE `/api/users/:id` (Auth + admin)
- POST `/api/users/avatar` (Auth, multipart)

