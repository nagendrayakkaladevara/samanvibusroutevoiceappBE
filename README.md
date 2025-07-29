# Expo Backend - Express TypeScript with PostgreSQL

A secure Express TypeScript backend for Expo apps using a PostgreSQL database for user authentication and management.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp env.example .env

# 3. Start development server
npm run dev

# 4. Test the server
curl http://localhost:3000/health
```

## Features

- 🔐 Basic authentication backed by PostgreSQL
- 📊 PostgreSQL integration for user management
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- 📝 TypeScript for type safety
- 🚀 Production-ready Express server
- 📱 Expo-friendly CORS configuration

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A PostgreSQL database (e.g. [Neon](https://neon.tech))

## Setup Instructions

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start the server
npm run dev
```


The server will start and connect to the configured PostgreSQL database.

### 3. Environment Configuration

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Update `.env` with your configuration:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=your-neon-connection-string

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

