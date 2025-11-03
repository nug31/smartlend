const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'loan_management',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Getting dashboard stats...');

    // Get total items count
    const itemsResult = await pool.query('SELECT COUNT(*) as count FROM items');
    const totalItems = parseInt(itemsResult.rows[0].count);

    // Get active loans count
    const activeLoansResult = await pool.query(
      "SELECT COUNT(*) as count FROM loans WHERE status = 'active'"
    );
    const activeLoans = parseInt(activeLoansResult.rows[0].count);

    // Get pending requests count
    const pendingRequestsResult = await pool.query(
      "SELECT COUNT(*) as count FROM loans WHERE status = 'pending'"
    );
    const pendingRequests = parseInt(pendingRequestsResult.rows[0].count);

    // Get overdue items count
    const overdueItemsResult = await pool.query(
      "SELECT COUNT(*) as count FROM loans WHERE status = 'overdue'"
    );
    const overdueItems = parseInt(overdueItemsResult.rows[0].count);

    // Get total users count
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get category breakdown
    const categoryBreakdownResult = await pool.query(`
      SELECT c.name as category, COUNT(i.id) as count 
      FROM categories c 
      LEFT JOIN items i ON c.id = i.category_id 
      GROUP BY c.id, c.name 
      ORDER BY count DESC
    `);
    const categoryBreakdown = categoryBreakdownResult.rows.map(row => ({
      category: row.category,
      count: parseInt(row.count)
    }));

    // Get loan trends for the past 7 days
    const loanTrendsResult = await pool.query(`
      SELECT 
        DATE(created_at) as date, 
        COUNT(*) as count 
      FROM loans 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at) 
      ORDER BY date ASC
    `);
    const loanTrends = loanTrendsResult.rows.map(row => ({
      date: row.date.toISOString().split('T')[0],
      count: parseInt(row.count)
    }));

    const dashboardStats = {
      totalItems,
      activeLoans,
      pendingRequests,
      overdueItems,
      totalUsers,
      categoryBreakdown,
      loanTrends
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

// GET /api/dashboard/recent-activity - Get recent activity
router.get('/recent-activity', async (req, res) => {
  try {
    console.log('📊 Getting recent activity...');

    const recentActivityResult = await pool.query(`
      SELECT 
        l.id,
        l.status,
        l.created_at,
        l.updated_at,
        u.name as user_name,
        i.name as item_name
      FROM loans l
      JOIN users u ON l.user_id = u.id
      JOIN items i ON l.item_id = i.id
      ORDER BY l.updated_at DESC
      LIMIT 10
    `);

    const recentActivity = recentActivityResult.rows.map(row => ({
      id: row.id,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      userName: row.user_name,
      itemName: row.item_name
    }));

    console.log('✅ Recent activity retrieved:', recentActivity.length, 'activities');
    res.json(recentActivity);

  } catch (error) {
    console.error('❌ Error getting recent activity:', error);
    res.status(500).json({ 
      error: 'Failed to get recent activity',
      details: error.message 
    });
  }
});

module.exports = router;
