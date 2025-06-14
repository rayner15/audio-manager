# Audio Hub - Full-Stack Audio Management Application

A modern, full-stack web application for uploading, managing, and playing audio files. Built with Next.js 14+, React, Prisma ORM, MySQL, and shadcn UI components.

## 🚀 Features

- **User Authentication**: Secure login/registration with NextAuth.js and JWT
- **Audio File Management**: Upload, organize, and manage audio files (MP3, WAV, M4A)
- **Category System**: Organize audio files by categories (Podcast, Music, Interview, etc.)
- **Audio Playback**: Built-in audio player for listening to uploaded files
- **User Profiles**: Manage user profiles and account settings
- **Responsive Design**: Modern UI with shadcn UI components and Tailwind CSS
- **Docker Support**: Complete containerization with Docker Compose

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
DATABASE_URL="mysql://root:root123@db:3306/audioworld"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-secret-key-here"

# JWT
JWT_SECRET="your-jwt-secret-key-here"

# File Upload
MAX_FILE_SIZE=26214400
UPLOAD_DIR="./uploads"
```

### 3. Start the Application
```bash
# Build and start all services
docker compose up --build

# Or run in detached mode
docker compose up --build -d
```

### 4. Access the Application
- **Web Application**: http://localhost:3000
- **MySQL Database**: localhost:3308 (user: root, password: root123)

## 🔐 Default Login Credentials

```
Username: admin
Password: password123
```

## 🐳 Docker Commands

```bash
# Start services
docker compose up

# Stop services
docker compose down

# View logs
docker compose logs -f app

# Access app container shell
docker compose exec app sh

# Access database
docker compose exec db mysql -u root -p
```

## 🎵 Supported Audio Formats

- **MP3** (audio/mpeg)
- **WAV** (audio/wav, audio/x-wav)
- **M4A** (audio/mp4, audio/m4a, audio/x-m4a)

Maximum file size: **25MB**

---

**Built with ❤️ using Next.js, Prisma, and shadcn UI**
