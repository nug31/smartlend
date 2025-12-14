# Loan Management System - Backend

This is the backend API for the Loan Management System, built with Node.js, Express, and PostgreSQL.

## Features

- User authentication and authorization
- Item management with QR codes
- Loan request and approval system
- Real-time notifications
- File upload support
- RESTful API design

## Database Schema

### Users
- Authentication and user management
- Role-based access control (admin/user)
- Profile information

### Items
- Item catalog with categories
- QR code generation
- Inventory tracking
- Maintenance scheduling

### Loans
- Loan request workflow
- Approval system
- Due date tracking
- Extension requests

## Railway Deployment

### 1. Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### 2. Add PostgreSQL Database
1. In your Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provide connection details

### 3. Deploy Backend
1. Connect your GitHub repository
2. Railway will auto-detect Node.js
3. Set environment variables (see below)

### 4. Environment Variables
Set these in Railway dashboard:

```env
# Database (Railway will provide these automatically)
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_here

# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 5. Build Commands
Railway will automatically run:
- `npm install`
- `npm start`

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Copy environment file:
   ```bash
   cp env.example .env
   ```

4. Update `.env` with your database credentials

5. Start development server:
   ```bash
   npm run dev
   ```

### Database Setup
The application will automatically create tables on first run. For manual setup:

```bash
# Connect to PostgreSQL and create database
createdb loan_management

# Or using psql
psql -U postgres
CREATE DATABASE loan_management;
```

## API Endpoints

### Health Check
- `GET /health` - Server status

### Items
- `GET /api/items` - List all active items
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item details
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Users
- `GET /api/users` - List all active users
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/users/:id` - Get user profile

### Loans
- `GET /api/loans` - List loans
- `POST /api/loans` - Create loan request
- `PUT /api/loans/:id/approve` - Approve loan
- `PUT /api/loans/:id/return` - Return item

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Loan.js
│   │   └── index.js
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── index.js
├── package.json
├── env.example
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License 