// Quick test script to verify production config
require('dotenv').config({ path: '.env.production' });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false
};

async function testProdConfig() {
    console.log('Testing production config for Aiven MySQL...');
    console.log('Config:', {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        database: dbConfig.database,
        ssl: dbConfig.ssl ? 'enabled' : 'disabled'
    });

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected successfully!\n');

        // Check tables
        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables in database:');
        tables.forEach(t => console.log(`  - ${Object.values(t)[0]}`));

        // Check users count
        const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
        console.log(`\nUsers count: ${users[0].count}`);

        // Check items count
        const [items] = await connection.query('SELECT COUNT(*) as count FROM items');
        console.log(`Items count: ${items[0].count}`);

        await connection.end();
        console.log('\n✅ Production config is working correctly!');
    } catch (error) {
        console.error('❌ Connection failed!');
        console.error('Error:', error.message);
    }
}

testProdConfig();
