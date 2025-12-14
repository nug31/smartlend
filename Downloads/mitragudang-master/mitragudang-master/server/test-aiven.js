// Test connection to Aiven MySQL
const mysql = require('mysql2/promise');

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
};

async function testConnection() {
    console.log('Testing Aiven MySQL connection...');
    console.log('Config:', {
        host: aivenConfig.host,
        port: aivenConfig.port,
        user: aivenConfig.user
    });

    try {
        const connection = await mysql.createConnection(aivenConfig);
        console.log('✅ Connected successfully!');

        const [rows] = await connection.query('SELECT 1 as test');
        console.log('Query result:', rows);

        // Try to show databases
        const [dbs] = await connection.query('SHOW DATABASES');
        console.log('Available databases:', dbs);

        await connection.end();
        console.log('Connection closed.');
    } catch (error) {
        console.error('❌ Connection failed!');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
    }
}

testConnection();
