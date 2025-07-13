# Expo Backend - Express TypeScript with Google Sheets Authentication

A secure Express TypeScript backend for Expo apps with Google Sheets-based user authentication.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp env.example .env

# 3. Start development server (without Google Sheets)
npm run dev

# 4. Test the server
curl http://localhost:3000/health
```

## Features

- 🔐 Basic authentication with Google Sheets
- 📊 Google Sheets integration for user management
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- 📝 TypeScript for type safety
- 🚀 Production-ready Express server
- 📱 Expo-friendly CORS configuration
- ⚡ Graceful fallback when Google Sheets not configured

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Platform account (optional for initial testing)
- Google Sheets with user credentials (optional for initial testing)

## Setup Instructions

### 1. Basic Setup (No Google Sheets)

For initial testing and development, you can run the server without Google Sheets:

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start the server
npm run dev
```

The server will start with authentication disabled and return empty user lists.

### 2. Google Sheets Setup (Optional)

To enable full authentication functionality:

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API

#### Step 2: Create a Service Account
1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name (e.g., "expo-backend-sheets")
4. Grant "Editor" role
5. Create and download the JSON key file

#### Step 3: Prepare Your Google Sheet
1. Create a new Google Sheet
2. Add your service account email as an editor
3. Structure your sheet with columns:
   - Column A: Username
   - Column B: Password
4. Add some test users (e.g., "admin" / "password123")

#### Step 4: Get Sheet Information
- Copy the Spreadsheet ID from the URL
- Note the sheet name and range (e.g., "Sheet1!A:B")

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

# Authentication Configuration
# No additional configuration needed for basic auth

# Google Sheets Configuration
GOOGLE_SHEETS_SPREADSHEET_ID=your-google-sheet-id-here
GOOGLE_SHEETS_RANGE=Sheet1!A:B
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Build and Run

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

### 5. Testing

#### Test Basic Setup
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test authentication endpoint (will fail without Google Sheets)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

#### Test with Google Sheets
Once you've configured Google Sheets, you can test authentication:

```bash
# Successful login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Failed login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wrong","password":"wrong"}'
```

## API Endpoints

### Authentication

#### POST /api/auth/login
Authenticate a user with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "username": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

**Error Response (503) - Google Sheets not configured:**
```json
{
  "success": false,
  "message": "Authentication service temporarily unavailable. Please try again later."
}
```

#### GET /api/auth/verify
Verify credentials using Basic Authentication.

**Headers:**
```
Authorization: Basic <base64-encoded-username:password>
```

**Example:**
```
Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "user": {
    "username": "admin"
  }
}
```

### Health Check

#### GET /health
Check server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Google Sheets Format

Your Google Sheet should be structured as follows:

| Username | Password |
|----------|----------|
| admin    | password123 |
| user1    | secret456 |
| user2    | mypass789 |

**Important Notes:**
- First row is treated as headers and skipped
- Username and password are case-sensitive
- Empty rows are automatically filtered out
- Username must be unique

## Security Features

- **Basic Authentication**: Simple username/password validation
- **Rate Limiting**: Prevents brute force attacks
- **CORS Protection**: Configured for Expo development
- **Input Validation**: Sanitizes and validates all inputs
- **Error Handling**: Comprehensive error management
- **Helmet**: Security headers middleware

## Development

### Project Structure
```
src/
├── index.ts              # Main server entry point
├── types/                # TypeScript type definitions
│   └── index.ts          # API interfaces and types
├── routes/               # API route handlers
│   └── auth.ts           # Authentication endpoints
├── services/             # Business logic
│   └── googleSheets.ts   # Google Sheets integration
├── middleware/           # Express middleware
│   ├── errorHandler.ts   # Global error handling
│   └── validation.ts     # Request validation
└── utils/                # Utility functions
    └── logger.ts         # Logging utility
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests (not implemented yet)

## Troubleshooting

### Common Issues

1. **Server Won't Start**
   - Make sure you've copied `env.example` to `.env`
   - Check that all dependencies are installed: `npm install`
   - Verify Node.js version is 16 or higher

2. **Google Sheets API Error**
   - Ensure the service account has access to the sheet
   - Check that the Google Sheets API is enabled
   - Verify the spreadsheet ID and range are correct
   - Make sure all environment variables are set correctly

3. **Authentication Issues**
   - Ensure Google Sheets credentials are correct
   - Check that usernames and passwords match exactly
   - Verify the Google Sheet format (username in column A, password in column B)

4. **CORS Errors in Expo**
   - Verify the CORS configuration includes your Expo development URLs
   - Check that the backend URL is correct in your Expo app
   - Ensure the server is running on the expected port

5. **Authentication Disabled Warning**
   - This is normal when Google Sheets is not configured
   - The server will still run but authentication will return empty results
   - Configure Google Sheets environment variables to enable authentication

### Logs
The application provides detailed logging for debugging:
- Request/response logging
- Authentication attempts
- Google Sheets operations
- Error details
- Configuration status (enabled/disabled)

### Development vs Production

**Development Mode:**
- Detailed logging enabled
- CORS allows all Expo development URLs
- Rate limiting is relaxed
- Google Sheets can be disabled for testing

**Production Mode:**
- Set `NODE_ENV=production` for reduced logging
- Configure specific CORS origins
- Stricter rate limiting
- Google Sheets must be properly configured

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper CORS origins for your production domain
3. Set up environment variables securely
4. Use a process manager like PM2
5. Set up HTTPS with a reverse proxy (nginx)
6. Consider implementing HTTPS for secure credential transmission

## License

MIT License - feel free to use this project for your own applications. 