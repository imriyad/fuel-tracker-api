const { pool } = require('../config/database');
const logger = require('../config/logger');

/**
 * Health check endpoint
 * Returns the status of the API and database connection
 */
const healthCheck = async (req, res) => {
  try {
    // Check database connection
    let dbStatus = 'disconnected';
    let dbMessage = 'Database not connected';

    try {
      const result = await pool.query('SELECT NOW()');
      if (result.rows.length > 0) {
        dbStatus = 'connected';
        dbMessage = 'Database connection successful';
      }
    } catch (dbError) {
      dbMessage = `Database connection failed: ${dbError.message}`;
      logger.error('Health check database error:', dbError);
    }

    // Return health status
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: {
        status: dbStatus,
        message: dbMessage,
      },
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
};

module.exports = {
  healthCheck,
};