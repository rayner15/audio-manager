# Audio Hub - Full-Stack Audio Management Application

A modern, full-stack web application for uploading, managing, and playing audio files. Built with Next.js 14+, React, Prisma ORM, MySQL, and shadcn UI components.

## 🚀 Features

- **User Authentication**: Secure login/registration with NextAuth.js and JWT
- **Audio File Management**: Upload, organize, and manage audio files (MP3, WAV, M4A)
- **Category System**: Organize audio files by categories (Podcast, Music, Interview, etc.)
- **Audio Playback**: Built-in audio player for listening to uploaded files
- **User Profiles**: Manage user profiles and account settings
- **Security**: Comprehensive middleware with rate limiting, CSRF protection, and JWT validation
- **Responsive Design**: Modern UI with shadcn UI components and Tailwind CSS
- **Docker Support**: Complete containerization with Docker Compose

## 🛠 Technology Stack

### Frontend
- **Next.js 14+** with App Router
- **React 19** with TypeScript
- **shadcn UI** component library
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### Backend
- **Next.js API Routes** with layered architecture
- **Prisma ORM** for database operations
- **NextAuth.js** for authentication
- **Winston** for logging
- **bcryptjs** for password hashing

### Database
- **MySQL 8.0** with Prisma schema
- **Audit logging** for all operations
- **Database seeding** with default data

### Security & Middleware
- **JWT authentication** with HS256 algorithm
- **Rate limiting** (100 requests per 15 minutes)
- **CSRF protection**
- **Origin/Referer validation**
- **File upload validation** (25MB limit)

## 📋 Prerequisites

- **Node.js** 18+ 
- **Docker** and **Docker Compose**
- **Git**

## 🚀 Quick Start with Docker

### 1. Clone the Repository
```bash
git clone <repository-url>
cd audio-manager
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="mysql://audiomanager:audiomanager123@localhost:3307/audiomanager"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-secret-key-here-change-in-production"

# JWT
JWT_SECRET="your-jwt-secret-key-here-change-in-production"

# File Upload
MAX_FILE_SIZE=26214400
UPLOAD_DIR="./uploads"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Start with a Single Command
```bash
# Build and start all services with automatic database setup
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

That's it! The application will:
1. Start the MySQL database
2. Wait for the database to be ready
3. Run database migrations automatically
4. Seed the database with default data
5. Start the Next.js application

### 4. Access the Application
- **Web Application**: http://localhost:3000
- **MySQL Database**: localhost:3307
- **Prisma Studio**: Run `npm run db:studio` for database GUI (requires local Node.js)

## 🔐 Default Login Credentials

```
Username: admin
Password: password123
```

## 📁 Project Structure

```
audio-manager/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── users/                # User management
│   │   ├── profile/              # Profile management
│   │   ├── audio/                # Audio file operations
│   │   └── categories/           # Category management
│   ├── dashboard/                # Dashboard page
│   ├── profile/                  # Profile page
│   ├── account/                  # Account management
│   ├── register/                 # Registration page
│   └── globals.css               # Global styles
├── lib/                          # Shared utilities
│   ├── services/                 # Business logic layer
│   │   ├── audio.svc.ts         # Audio service
│   │   ├── audio.dao.ts         # Audio data access
│   │   ├── user.svc.ts          # User service
│   │   └── user.dao.ts          # User data access
│   ├── prisma.ts                # Prisma client
│   ├── auth.ts                  # NextAuth configuration
│   └── logger.ts                # Winston logger
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding
├── types/                        # TypeScript type definitions
├── middleware.ts                 # Security middleware
├── Dockerfile                    # Docker configuration
├── docker-compose.yml           # Docker Compose setup
└── README.md                    # This file
```

## 🔧 Development Setup (Without Docker)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Start MySQL locally or use Docker
docker run --name mysql-audio -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=audiomanager -e MYSQL_USER=audiomanager -e MYSQL_PASSWORD=audiomanager123 -p 3307:3306 -d mysql:8.0.36

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### User Management
- `POST /api/register` - Register new user
- `GET /api/user/me` - Get current user profile
- `PUT /api/user/me` - Update user credentials
- `DELETE /api/user/me` - Delete user account

### Profile Management
- `POST /api/profile` - Create user profile
- `PUT /api/profile/me` - Update user profile

### Audio Management
- `GET /api/audio` - List user's audio files
- `POST /api/audio/upload` - Upload audio file
- `GET /api/audio/[fileId]` - Get audio file details
- `PUT /api/audio/[fileId]` - Update audio file
- `DELETE /api/audio/[fileId]` - Delete audio file

### Categories
- `GET /api/categories` - List all categories

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents abuse with configurable limits
- **CSRF Protection**: Cross-site request forgery protection
- **File Validation**: Strict file type and size validation
- **Audit Logging**: Complete audit trail of all operations

## 📊 Database Schema

The application uses the following main entities:

- **Account**: User accounts with credentials
- **UserProfile**: Extended user information
- **Category**: Audio file categories
- **AudioFile**: Uploaded audio files with metadata
- **AuditLog**: Audit trail for all operations

## 🎵 Supported Audio Formats

- **MP3** (audio/mpeg)
- **WAV** (audio/wav, audio/x-wav)
- **M4A** (audio/mp4, audio/m4a, audio/x-m4a)

Maximum file size: **25MB**

## 🐳 Docker Commands

```bash
# Build and start services (single command setup)
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Access app container shell
docker-compose exec app sh

# Access database
docker-compose exec db mysql -u audiomanager -p audiomanager

# Remove all containers and volumes
docker-compose down -v
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | Required |
| `NEXTAUTH_URL` | NextAuth base URL | http://localhost:3000 |
| `NEXTAUTH_SECRET` | NextAuth secret key | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `MAX_FILE_SIZE` | Max upload size in bytes | 26214400 (25MB) |
| `UPLOAD_DIR` | File upload directory | ./uploads |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 🚀 Production Deployment

1. **Update Environment Variables**: Change all secrets and passwords
2. **SSL/TLS**: Configure HTTPS in production
3. **Database**: Use managed MySQL service
4. **File Storage**: Consider cloud storage for uploads
5. **Monitoring**: Add application monitoring and logging
6. **Backup**: Implement database backup strategy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check DATABASE_URL format
   - Verify credentials

2. **File Upload Issues**
   - Check file size limits
   - Verify upload directory permissions
   - Ensure supported file format

3. **Authentication Problems**
   - Verify JWT_SECRET is set
   - Check NEXTAUTH_SECRET configuration
   - Clear browser cookies

4. **Docker Issues**
   - Run `docker-compose down -v` to reset
   - Check Docker daemon is running
   - Verify port availability

### Getting Help

- Check the logs: `docker-compose logs -f app`
- Review the database: `npm run db:studio`
- Verify environment variables
- Check file permissions

---

**Built with ❤️ using Next.js, Prisma, and shadcn UI**
