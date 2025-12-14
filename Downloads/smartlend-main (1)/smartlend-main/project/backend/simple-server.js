import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', database: 'PostgreSQL' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'PostgreSQL server is running!' });
});

// Start server
async function startServer() {
  try {
    console.log('🔄 Testing PostgreSQL connection...');
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Simple server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

startServer();
