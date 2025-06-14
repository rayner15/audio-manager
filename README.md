# Audio Hub - Full-Stack Audio Management Application

A modern, full-stack web application for uploading, managing, and playing audio files. Built with Next.js 14+, React, Prisma ORM, MySQL, and shadcn UI components.

## 🚀 Features

- **User Authentication**: Secure login/registration with NextAuth.js and JWT
- **Audio File Management**: Upload, organize, and manage audio files (MP3 and WAV)
- **Category System**: Organize audio files by categories (Podcast, Music, Interview, etc.)
- **Audio Playback**: Built-in audio player for listening to uploaded files
- **User Profiles**: Manage user profiles and account settings
- **Responsive Design**: Modern UI with shadcn UI components and Tailwind CSS
- **Docker Support**: Complete containerization with Docker Compose

## 📋 Prerequisites

- **Node.js** 18+ 
- **Docker** - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download Git](https://git-scm.com/downloads)

## 🚀 Quick Start with Docker

### 1. Clone the Repository
```bash
git clone https://github.com/rayner15/audio-manager.git
cd audio-manager
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```bash
# Create .env file with required configuration
cat > .env << EOL
DATABASE_URL=mysql://root:root123@localhost:3308/audioworld
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-secret-key-here"
JWT_SECRET="your-jwt-secret-key-here"
EOL
```

### 3. Start the Application
```bash
docker compose up --build
```

### 4. Access the Application
- **Web Application**: http://localhost:3000
- **MySQL Database**: localhost:3308 (user: root, password: root123)

## 🔐 Default Login Credentials

```
Username: john_doe
Password: johndoe123
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

## 🔧 Troubleshooting

### 1. Windows Docker Issues

If you encounter this specific ❌ error when running Docker:
```diff
- app-1  | exec /app/docker-entrypoint.sh: no such file or directory
```

Open Git Bash in Windows, navigate to your project directory, and run:
```bash
cd /path/to/audio-manager
dos2unix docker-entrypoint.sh
```

### 2. Running App Locally with Docker Database

If you want to run just the database in Docker and the app locally:

#### 1. Start MySQL Database in Docker
```bash
# Start only the database container in detached mode
docker compose up db -d

# Verify the database is running
docker ps
```

#### 2. Install Dependencies and Build the Application
```bash
npm install && npm run build
```

#### 3. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

#### 4. Seed the Database
```bash
npx prisma db seed
```

#### 5. Start the Development Server
```bash
npm run dev
```

#### 6. Access the Application
- **Web Application**: http://localhost:3000
- **MySQL Database**: localhost:3308 (user: root, password: root123)

## 🎵 Supported Audio Formats

- **MP3** (audio/mpeg)
- **WAV** (audio/wav, audio/x-wav)
- **M4A** (audio/mp4, audio/m4a, audio/x-m4a)

Maximum file size: **25MB**

---

**Built with ❤️ using Next.js, Prisma, and shadcn UI**
