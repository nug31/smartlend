const { Client } = require('pg');

// PostgreSQL Railway connection
const POSTGRES_CONFIG = {
  host: 'trolley.proxy.rlwy.net',
  port: 25351,
  user: 'postgres',
  password: 'tAcyywGrcGlyNctqFVoACoyEMGMDgFjH',
  database: 'railway',
  ssl: {
    rejectUnauthorized: false
  }
};

// Sample user data to add
const USERS_TO_ADD = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1234567890',
    department: 'IT',
    role: 'admin',
    password: 'admin123'
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567891',
    department: 'Engineering',
    role: 'user',
    password: 'user123'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567892',
    department: 'Marketing',
    role: 'user',
    password: 'user123'
  },
  {
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1234567893',
    department: 'Sales',
    role: 'user',
    password: 'user123'
  },
  {
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '+1234567894',
    department: 'HR',
    role: 'user',
    password: 'user123'
  }
];

async function addUsersToPostgreSQL() {
  let client;
  
  try {
    console.log('🔌 Connecting to PostgreSQL Railway...');
    client = new Client(POSTGRES_CONFIG);
    await client.connect();
    console.log('✅ Connected to PostgreSQL Railway successfully!');

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('📋 Creating users table...');
      await client.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(50),
          department VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Users table created successfully!');
    } else {
      console.log('✅ Users table already exists');
    }

    // Add users
    for (const userData of USERS_TO_ADD) {
      try {
        // Check if user already exists
        const existingUser = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [userData.email]
        );

        if (existingUser.rows.length > 0) {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
          continue;
        }

        // Hash password (using simple hash for demo)
        const hashedPassword = require('crypto').createHash('sha256').update(userData.password).digest('hex');

        // Insert user
        const insertResult = await client.query(`
          INSERT INTO users (name, email, phone, department, role, password)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `, [
          userData.name,
          userData.email,
          userData.phone,
          userData.department,
          userData.role,
          hashedPassword
        ]);

        console.log(`✅ User ${userData.email} added successfully!`);
        console.log(`   - ID: ${insertResult.rows[0].id}`);
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
    console.log('📋 Current users in PostgreSQL database:');
    const usersResult = await client.query('SELECT id, name, email, role, department, created_at FROM users ORDER BY created_at DESC');
    
    usersResult.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.department || 'N/A'} - Created: ${user.created_at}`);
    });

    console.log(`\n📊 Total users in PostgreSQL: ${usersResult.rows.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      await client.end();
      console.log('🔌 PostgreSQL connection closed');
    }
  }
}

// Run the script
addUsersToPostgreSQL();


