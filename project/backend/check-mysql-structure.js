const mysql = require('mysql2/promise');

// MySQL Railway connection
const MYSQL_CONFIG = {
  host: 'nozomi.proxy.rlwy.net',
  port: 21817,
  user: 'root',
  password: 'pvOcQbzlDAobtcdozbMvCdIDDEmenwkO',
  database: 'railway'
};

async function checkMySQLStructure() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL Railway...');
    connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Connected to MySQL Railway successfully!');

    // Check if users table exists
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Available tables:');
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    // Check users table structure if it exists
    try {
      const [columns] = await connection.execute('DESCRIBE users');
      console.log('\n📋 Users table structure:');
      columns.forEach(column => {
        console.log(`   - ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
      });
    } catch (error) {
      console.log('❌ Users table does not exist yet');
    }

    // Check if there are any existing users
    try {
      const [users] = await connection.execute('SELECT * FROM users LIMIT 5');
      console.log(`\n👥 Existing users (${users.length}):`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${JSON.stringify(user)}`);
      });
    } catch (error) {
      console.log('❌ Cannot query users table:', error.message);
    }

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
checkMySQLStructure();


