const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// MySQL Railway connection
const MYSQL_CONFIG = {
  host: 'nozomi.proxy.rlwy.net',
  port: 21817,
  user: 'root',
  password: 'pvOcQbzlDAobtcdozbMvCdIDDEmenwkO',
  database: 'railway'
};

// Sample user data to add - matching existing table structure
const USERS_TO_ADD = [
  {
    name: 'Admin Test',
    email: 'admin.test@example.com',
    department: 'IT Department',
    role: 'admin',
    password: 'admin123'
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    role: 'user',
    password: 'user123'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    department: 'Marketing',
    role: 'user',
    password: 'user123'
  },
  {
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    department: 'Sales',
    role: 'user',
    password: 'user123'
  },
  {
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    department: 'HR',
    role: 'user',
    password: 'user123'
  }
];

async function addUsersToMySQL() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL Railway...');
    connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Connected to MySQL Railway successfully!');

    // Add users using existing table structure
    for (const userData of USERS_TO_ADD) {
      try {
        // Check if user already exists
        const [existingUsers] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [userData.email]
        );

        if (existingUsers.length > 0) {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Generate UUID
        const userId = require('crypto').randomUUID();

        // Insert user - matching existing table structure
        const insertSQL = `
          INSERT INTO users (id, name, email, password, role, department, avatar_url, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        await connection.execute(insertSQL, [
          userId,
          userData.name,
          userData.email,
          hashedPassword,
          userData.role,
          userData.department,
          null // avatar_url
        ]);

        console.log(`✅ User ${userData.email} added successfully!`);
        console.log(`   - ID: ${userId}`);
        console.log(`   - Name: ${userData.name}`);
        console.log(`   - Role: ${userData.role}`);
        console.log(`   - Department: ${userData.department}`);
        console.log(`   - Password: ${userData.password}`);
        console.log('');

      } catch (error) {
        console.error(`❌ Error adding user ${userData.email}:`, error.message);
      }
    }

    // Show all users
    console.log('📋 Current users in database:');
    const [users] = await connection.execute('SELECT id, name, email, role, department, created_at FROM users ORDER BY created_at DESC LIMIT 10');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.department || 'N/A'} - Created: ${user.created_at}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 MySQL connection closed');
    }
  }
}

// Run the script
addUsersToMySQL();
