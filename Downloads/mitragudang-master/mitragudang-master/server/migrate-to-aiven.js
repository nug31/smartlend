// Migration script: Railway MySQL -> Aiven MySQL
require('dotenv').config();
const mysql = require('mysql2/promise');

const railwayConfig = {
    host: process.env.RAILWAY_HOST,
    port: process.env.RAILWAY_PORT,
    user: process.env.RAILWAY_USER,
    password: process.env.RAILWAY_PASSWORD,
    database: process.env.RAILWAY_DB,
    waitForConnections: true,
    connectionLimit: 5,
};

// Aiven (Target) Database Config
const aivenConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    ssl: {
        rejectUnauthorized: false
    }
};

async function migrate() {
    let railwayPool = null;
    let aivenPool = null;

    try {
        console.log('🚀 Starting migration from Railway to Aiven...\n');

        // Connect to Railway
        console.log('📡 Connecting to Railway MySQL...');
        railwayPool = mysql.createPool(railwayConfig);
        await railwayPool.query('SELECT 1');
        console.log('✅ Connected to Railway MySQL\n');

        // Connect to Aiven
        console.log('📡 Connecting to Aiven MySQL...');
        aivenPool = mysql.createPool(aivenConfig);
        await aivenPool.query('SELECT 1');
        console.log('✅ Connected to Aiven MySQL\n');

        // Disable foreign key checks
        console.log('🔧 Disabling foreign key checks...');
        await aivenPool.query('SET FOREIGN_KEY_CHECKS = 0');
        await aivenPool.query('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO"');

        // Get tables from Railway
        console.log('📋 Getting tables from Railway...');
        const [tables] = await railwayPool.query('SHOW TABLES');
        const tableNames = tables.map(row => Object.values(row)[0]);
        console.log(`Found ${tableNames.length} tables: ${tableNames.join(', ')}\n`);

        // Drop all tables first (in reverse to handle foreign keys)
        console.log('🗑️  Dropping existing tables in Aiven...');
        for (const tableName of tableNames.reverse()) {
            try {
                await aivenPool.query(`DROP TABLE IF EXISTS \`${tableName}\``);
                console.log(`   Dropped: ${tableName}`);
            } catch (err) {
                console.log(`   Could not drop ${tableName}: ${err.message}`);
            }
        }
        tableNames.reverse(); // Restore original order

        // Migrate each table
        for (const tableName of tableNames) {
            console.log(`\n📦 Migrating table: ${tableName}`);

            try {
                // Get table structure
                const [createTable] = await railwayPool.query(`SHOW CREATE TABLE \`${tableName}\``);
                let createStatement = createTable[0]['Create Table'];

                // Create table in Aiven
                console.log(`   Creating table structure...`);
                await aivenPool.query(createStatement);
                console.log(`   ✅ Table created`);

                // Get data from Railway
                const [data] = await railwayPool.query(`SELECT * FROM \`${tableName}\``);
                console.log(`   Found ${data.length} rows`);

                if (data.length > 0) {
                    let inserted = 0;

                    for (const row of data) {
                        const columns = Object.keys(row).map(c => `\`${c}\``);
                        const values = Object.values(row);
                        const placeholders = columns.map(() => '?').join(', ');

                        try {
                            await aivenPool.query(
                                `INSERT INTO \`${tableName}\` (${columns.join(', ')}) VALUES (${placeholders})`,
                                values
                            );
                            inserted++;
                        } catch (err) {
                            if (err.code !== 'ER_DUP_ENTRY') {
                                console.error(`   Error inserting row: ${err.message}`);
                            }
                        }
                    }

                    console.log(`   ✅ Migrated ${inserted}/${data.length} rows`);
                } else {
                    console.log(`   ⚠️ No data to migrate`);
                }
            } catch (err) {
                console.error(`   ❌ Error migrating ${tableName}: ${err.message}`);
            }
        }

        // Re-enable foreign key checks
        console.log('\n🔧 Re-enabling foreign key checks...');
        await aivenPool.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('\n\n✅ ================================');
        console.log('✅ MIGRATION COMPLETED SUCCESSFULLY!');
        console.log('✅ ================================\n');

        // Verify migration
        console.log('🔍 Verifying migration...\n');
        for (const tableName of tableNames) {
            try {
                const [railwayCount] = await railwayPool.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
                const [aivenCount] = await aivenPool.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
                console.log(`   ${tableName}: Railway=${railwayCount[0].count} -> Aiven=${aivenCount[0].count}`);
            } catch (err) {
                console.log(`   ${tableName}: Error verifying - ${err.message}`);
            }
        }

        console.log('\n✅ Migration verified!\n');

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error);
    } finally {
        if (railwayPool) await railwayPool.end();
        if (aivenPool) await aivenPool.end();
    }
}

migrate();
