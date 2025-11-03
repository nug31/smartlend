# Users Database - MySQL Railway

## 📊 Database Summary
- **Total Users**: 110
- **Admin Users**: 3
- **Manager Users**: 1  
- **Regular Users**: 106

## 🔐 Test Users Added (Latest)

### Admin User
- **Email**: admin.test@example.com
- **Password**: admin123
- **Role**: admin
- **Department**: IT Department
- **ID**: 19e051b2-...

### Regular Users
1. **John Doe**
   - Email: john.doe@example.com
   - Password: user123
   - Department: Engineering
   - Role: user

2. **Jane Smith**
   - Email: jane.smith@example.com
   - Password: user123
   - Department: Marketing
   - Role: user

3. **Bob Johnson**
   - Email: bob.johnson@example.com
   - Password: user123
   - Department: Sales
   - Role: user

4. **Alice Brown**
   - Email: alice.brown@example.com
   - Password: user123
   - Department: HR
   - Role: user

## 🚀 Available Scripts

### Add New Users
```bash
npm run add-users
```
- Adds sample users to the database
- Automatically checks for duplicates
- Hashes passwords securely

### List All Users
```bash
npm run list-users
```
- Shows all users in formatted table
- Provides role and department summaries
- Shows creation dates

## 🔧 Database Connection
- **Host**: nozomi.proxy.rlwy.net
- **Port**: 21817
- **Database**: railway
- **User**: root
- **Password**: pvOcQbzlDAobtcdozbMvCdIDDEmenwkO

## 📋 Table Structure
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','user') NOT NULL,
  department VARCHAR(100) NULL,
  avatar_url VARCHAR(255) NULL,
  created_at TIMESTAMP NULL
);
```

## 🎯 Usage in Application
These users can now be used to:
- Test login functionality
- Test role-based access control
- Test user management features
- Demo the application to stakeholders

## ⚠️ Security Notes
- Passwords are hashed using bcrypt
- Test passwords are simple for development
- Change passwords in production environment
- Consider adding password complexity requirements


