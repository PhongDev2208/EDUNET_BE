# EduNet Backend

## 📋 Mô tả

EduNet Backend là API server cho hệ thống học trực tuyến EduNet, được xây dựng trên nền tảng NestJS với TypeORM và PostgreSQL.

## 🛠 Công nghệ sử dụng

- **Framework:** NestJS v11
- **ORM:** TypeORM v0.3
- **Database:** PostgreSQL
- **Authentication:** JWT (Access Token + Refresh Token)
- **Validation:** class-validator, class-transformer
- **Language:** TypeScript

## 📁 Cấu trúc dự án

```
src/
├── core/                    # Core infrastructure
│   ├── config/             # Database và app config
│   ├── database/           # TypeORM data sources
│   ├── decorators/         # Custom decorators (FilteringParams, SortingParams, etc.)
│   ├── guards/             # AuthGuard
│   ├── helpers/            # Helper functions (getWhere, getOrder, getRelations)
│   ├── middlewares/        # AuthMiddleware
│   ├── pipes/              # BackendValidationPipe
│   ├── responses/          # SuccessResponse, ErrorResponse
│   ├── services/           # JwtService
│   └── types/              # Type definitions
├── auth/                   # Authentication module
├── user/                   # User management
├── session/                # Session management
├── password-reset/         # Password reset
├── category/               # Course categories
├── course/                 # Courses
├── teacher/                # Teacher management
├── student/                # Student management
├── enrollment/             # Course enrollments
├── lesson/                 # Course lessons
├── material/               # Course materials
├── assignment/             # Assignments
├── quiz/                   # Quizzes
├── review/                 # Course reviews
├── schedule/               # Schedules
├── support-ticket/         # Support tickets
└── migrations/             # Database migrations
```

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `.env.example` và cập nhật thông tin database:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
DATABASE_HOST="localhost"
DATABASE_PORT="5432"
DATABASE_USER="postgres"
DATABASE_PASSWORD="your_password"  # Thay đổi password
DATABASE_DB="edunet_db"
DATABASE_SCHEMA="public"
PORT="3000"

JWT_SECRET="your_jwt_secret_key"
PASSWORD_SECRET="your_password_secret"

FE_URL="http://localhost:5173"
```

### 3. Tạo database

Tạo database `edunet_db` trong PostgreSQL:

```sql
CREATE DATABASE edunet_db;
```

### 4. Chạy migrations

```bash
npm run migration:migrate
```

### 5. Chạy development server

```bash
npm run start:dev
```

Server sẽ chạy tại `http://localhost:3000`

## 📜 Scripts

| Script | Mô tả |
|--------|-------|
| `npm run start:dev` | Chạy development server với hot-reload |
| `npm run build` | Build production |
| `npm run start:prod` | Chạy production server |
| `npm run migration:migrate` | Chạy migrations |
| `npm run migration:rollback` | Rollback migration cuối |
| `npm run migration:create:name -- <name>` | Tạo migration mới |
| `npm run lint` | Kiểm tra linting |
| `npm run test` | Chạy unit tests |

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `GET /auth/profile` - Lấy thông tin user (Auth required)
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Đăng xuất
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/reset-password` - Đặt lại mật khẩu

### Users
- `GET /users` - Danh sách users
- `GET /users/:id` - Chi tiết user
- `PATCH /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

### Categories
- `GET /categories` - Danh sách categories
- `GET /categories/:id` - Chi tiết category
- `POST /categories` - Tạo category (Auth)
- `PATCH /categories/:id` - Cập nhật category (Auth)
- `DELETE /categories/:id` - Xóa category (Auth)

### Courses
- `GET /courses` - Danh sách courses
- `GET /courses/:id` - Chi tiết course
- `GET /courses/featured` - Courses nổi bật
- `POST /courses` - Tạo course (Auth)
- `PATCH /courses/:id` - Cập nhật course (Auth)
- `DELETE /courses/:id` - Xóa course (Auth)

### Enrollments
- `GET /enrollments` - Danh sách enrollments
- `POST /enrollments` - Đăng ký khóa học (Auth)
- `GET /enrollments/my-courses` - Khóa học đã đăng ký (Auth)

### Lessons
- `GET /lessons` - Danh sách lessons
- `GET /lessons/:id` - Chi tiết lesson
- `GET /lessons/course/:courseId` - Lessons theo course

### Quizzes
- `GET /quizzes` - Danh sách quizzes
- `GET /quizzes/:id` - Chi tiết quiz
- `POST /quizzes/:id/start` - Bắt đầu làm quiz (Auth)
- `POST /quizzes/attempts/:attemptId/submit` - Nộp quiz (Auth)

### Reviews
- `GET /reviews` - Danh sách reviews
- `GET /reviews/course/:courseId` - Reviews theo course
- `POST /reviews` - Tạo review (Auth)

### Schedules
- `GET /schedules` - Danh sách schedules
- `GET /schedules/upcoming` - Lịch sắp tới

### Support Tickets
- `GET /support-tickets` - Danh sách tickets (Auth)
- `POST /support-tickets` - Tạo ticket (Auth)
- `GET /support-tickets/my-tickets` - Tickets của tôi (Auth)

## 🔧 Query Parameters

### Pagination
```
?page=1&limit=10
```

### Filtering
```
?filter=status:eq:published
?filter=price:gte:100
?filter=title:like:javascript
```

Các operator hỗ trợ: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `in`, `isnull`

### Sorting
```
?sort=createdAt:desc
?sort=price:asc
```

### Including Relations
```
?include=category,teacher
```

## 📄 License

MIT
