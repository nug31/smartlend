# Loan Management System

A comprehensive loan management system built with React (TypeScript) frontend and Node.js backend with PostgreSQL database.

**Latest Update**: Removed i18n dependencies for improved performance and simplified codebase.

## Features

### 🔐 Authentication & Authorization
- User registration and login
- Role-based access control (Admin/User)
- Secure session management

### 📊 Dashboard
- Real-time statistics and analytics
- Quick overview of loans, items, and users
- Interactive charts and metrics

### 📦 Item Management
- Complete item catalog with categories
- Item condition tracking
- Quantity management
- Image and tag support
- Search and filter functionality

### 🏦 Loan Management
- Loan request system
- Approval workflow
- Return tracking
- Overdue notifications
- Loan history

### 👥 User Management (Admin)
- User registration approval
- Role assignment
- User activity monitoring

### 📅 Calendar Integration
- Visual loan scheduling
- Availability tracking
- Conflict detection

### 📈 Analytics & Reporting
- Usage statistics
- Popular items tracking
- User activity reports
- Export functionality

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Sequelize** ORM
- **CORS** enabled
- RESTful API design

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/nug31/loan.git
cd loan
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/loan_db
PORT=3002
```

### 3. Frontend Setup
```bash
# From project root
npm install
```

### 4. Database Setup
The application will automatically create tables and seed sample data on first run.

### 5. Running the Application

#### Start Backend (Terminal 1):
```bash
cd backend
node server-pg.js
```

#### Start Frontend (Terminal 2):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002

## Default Users

The system comes with pre-seeded users:

### Admin User
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: Admin

### Regular User
- **Email**: john.doe@example.com
- **Password**: user123
- **Role**: User

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item (Admin)
- `PUT /api/items/:id` - Update item (Admin)
- `DELETE /api/items/:id` - Delete item (Admin)

### Loans
- `GET /api/loans` - Get user loans
- `POST /api/loans` - Create loan request
- `PUT /api/loans/:id` - Update loan status
- `DELETE /api/loans/:id` - Cancel loan

### Users (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Project Structure

```
loan/
├── backend/
│   ├── server-pg.js          # Main server file
│   ├── src/
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   └── seeders/          # Database seeders
│   └── package.json
├── src/
│   ├── components/           # React components
│   │   ├── Admin/           # Admin-only components
│   │   ├── Auth/            # Authentication components
│   │   ├── Dashboard/       # Dashboard components
│   │   ├── Layout/          # Layout components
│   │   └── ...
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   ├── services/            # API services
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── public/                  # Static assets
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub.
