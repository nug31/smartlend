const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const sequelize = require('./config/database.js');
const { User, Item, Loan, Category } = require('./models/index.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration - Allow multiple frontend ports for development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'none'}`);
  next();
});



// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Basic API routes

// Items endpoints
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.findAll({ where: { isActive: true } });

    // Process tags to ensure they are arrays
    const processedItems = items.map(item => {
      const itemData = item.toJSON();

      // Parse tags if it's a string
      if (typeof itemData.tags === 'string') {
        try {
          itemData.tags = JSON.parse(itemData.tags);
        } catch (e) {
          itemData.tags = [];
        }
      }

      // Parse images if it's a string
      if (typeof itemData.images === 'string') {
        try {
          itemData.images = JSON.parse(itemData.images);
        } catch (e) {
          itemData.images = [];
        }
      }

      return itemData;
    });

    console.log(`✅ GET /api/items - returning ${processedItems.length} items`);
    res.json(processedItems);
  } catch (error) {
    console.error('❌ Error fetching items:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    console.log('📥 PUT /api/items/:id received data:', req.body);
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.update(req.body);
    console.log('✅ Item updated successfully:', item.toJSON());
    res.json(item);
  } catch (error) {
    console.error('❌ Error updating item:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Soft delete by setting isActive to false
    await item.update({ isActive: false });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Loans endpoints
app.get('/api/loans', async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        { model: Item, as: 'item', attributes: ['name', 'category'] },
        { model: User, as: 'user', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'approver', attributes: ['firstName', 'lastName'], required: false }
      ]
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/loans', async (req, res) => {
  try {
    const loan = await Loan.create(req.body);
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/loans/:id/approve', async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    await loan.update({
      status: 'approved',
      approvedAt: new Date(),
      approverId: req.body.approverId || null
    });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/loans/:id/reject', async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    await loan.update({
      status: 'rejected',
      approverId: req.body.approverId || null
    });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/loans/:id/return', async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    await loan.update({
      status: 'returned',
      actualReturnDate: new Date()
    });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users endpoints
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isActive: true },
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    console.log('📥 POST /api/categories received data:', req.body);
    const category = await Category.create(req.body);
    console.log('✅ Category created successfully:', category.toJSON());
    res.status(201).json(category);
  } catch (error) {
    console.error('❌ Error creating category:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    console.log('📥 PUT /api/categories/:id received data:', req.body);
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.update(req.body);
    console.log('✅ Category updated successfully:', category.toJSON());
    res.json(category);
  } catch (error) {
    console.error('❌ Error updating category:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category is being used by any items
    const itemsUsingCategory = await Item.count({
      where: { category: category.name, isActive: true }
    });

    if (itemsUsingCategory > 0) {
      return res.status(400).json({
        error: `Cannot delete category. ${itemsUsingCategory} items are using this category.`
      });
    }

    // Soft delete by setting isActive to false
    await category.update({ isActive: false });
    console.log('✅ Category deleted successfully:', category.name);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting category:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard Stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    console.log('📊 Getting dashboard stats...');

    // Get total items count
    const totalItems = await Item.count();

    // Get active loans count (only 'active' status for consistency with Manage Loans)
    const activeLoans = await Loan.count({
      where: { status: 'active' }
    });

    // Get pending requests count
    const pendingRequests = await Loan.count({
      where: { status: 'pending' }
    });

    // Get overdue items count
    const overdueItems = await Loan.count({
      where: { status: 'overdue' }
    });

    // Get total users count
    const totalUsers = await User.count();

    // Get category breakdown
    const categories = await Category.findAll({
      include: [{
        model: Item,
        as: 'items',
        attributes: []
      }],
      attributes: [
        'name',
        [sequelize.fn('COUNT', sequelize.col('items.id')), 'count']
      ],
      group: ['Category.id', 'Category.name'],
      raw: true
    });

    const categoryBreakdown = categories.map(cat => ({
      category: cat.name,
      count: parseInt(cat.count) || 0
    }));

    // Get loan trends for the past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const loanTrends = await Loan.findAll({
      where: {
        createdAt: {
          [sequelize.Op.gte]: sevenDaysAgo
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    const formattedLoanTrends = loanTrends.map(trend => ({
      date: trend.date,
      count: parseInt(trend.count)
    }));

    const dashboardStats = {
      totalItems,
      activeLoans,
      pendingRequests,
      overdueItems,
      totalUsers,
      categoryBreakdown,
      loanTrends: formattedLoanTrends
    };

    console.log('✅ Dashboard stats retrieved:', dashboardStats);
    res.json(dashboardStats);

  } catch (error) {
    console.error('❌ Error getting dashboard stats:', error);
    res.status(500).json({
      error: 'Failed to get dashboard stats',
      details: error.message
    });
  }
});



// Database connection and server start
async function startServer() {
  try {
    console.log('🔄 Starting server...');
    console.log('🔄 Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

    // Test database connection
    console.log('🔄 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database (create tables if they don't exist)
    console.log('🔄 Synchronizing database...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    console.error('❌ Full error:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();