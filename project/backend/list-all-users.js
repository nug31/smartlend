const mysql = require('mysql2/promise');

// MySQL Railway connection
const MYSQL_CONFIG = {
  host: 'nozomi.proxy.rlwy.net',
  port: 21817,
  user: 'root',
  password: 'pvOcQbzlDAobtcdozbMvCdIDDEmenwkO',
  database: 'railway'
};

async function listAllUsers() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL Railway...');
    connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ Connected to MySQL Railway successfully!\n');

    // Get all users
    const [users] = await connection.execute('SELECT * FROM users ORDER BY created_at DESC');
    
    console.log(`📋 Total Users: ${users.length}\n`);
    console.log('='.repeat(100));
    console.log('ID'.padEnd(38) + ' | ' + 'Name'.padEnd(25) + ' | ' + 'Email'.padEnd(30) + ' | ' + 'Role'.padEnd(8) + ' | ' + 'Department'.padEnd(15) + ' | ' + 'Created');
    console.log('='.repeat(100));
    
    users.forEach((user, index) => {
      const id = user.id.substring(0, 8) + '...';
      const name = user.name.length > 25 ? user.name.substring(0, 22) + '...' : user.name;
      const email = user.email.length > 30 ? user.email.substring(0, 27) + '...' : user.email;
      const role = user.role.padEnd(8);
      const department = (user.department || 'N/A').padEnd(15);
      const created = new Date(user.created_at).toLocaleDateString('id-ID');
      
      console.log(`${id} | ${name.padEnd(25)} | ${email.padEnd(30)} | ${role} | ${department} | ${created}`);
    });
    
    console.log('='.repeat(100));
    
    // Summary by role
    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role === 'user').length;
    const managerCount = users.filter(u => u.role === 'manager').length;
    
    console.log(`\n📊 Summary by Role:`);
    console.log(`   👑 Admin: ${adminCount}`);
    console.log(`   👨‍💼 Manager: ${managerCount}`);
    console.log(`   👤 User: ${userCount}`);
    
    // Summary by department
    const departments = {};
    users.forEach(user => {
      const dept = user.department || 'N/A';
      departments[dept] = (departments[dept] || 0) + 1;
    });
    
    console.log(`\n🏢 Summary by Department:`);
    Object.entries(departments).forEach(([dept, count]) => {
      console.log(`   ${dept}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 MySQL connection closed');
    }
  }
}

// Run the script
listAllUsers();


