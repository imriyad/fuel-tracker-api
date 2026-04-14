const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('express-async-errors');
require('dotenv').config();

const logger = require('./config/logger');
const { errorHandler, errorConverter, notFoundHandler } = require('./middlewares/errorHandler');
const healthRoutes = require('./routes/healthRoutes');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// HTTP request logger
app.use(morgan('combined', { stream: logger.stream }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

const authRoutes = require('./routes/authRoutes');
const stationRoutes = require('./routes/stationRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const fuelEntryRoutes = require('./routes/fuelEntryRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/fuel-entries', fuelEntryRoutes);
app.use('/api/health', healthRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Fuel Tracker API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
  });
});

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error converter - convert errors to ApiError
app.use(errorConverter);

// Error handler - must be last
app.use(errorHandler);

module.exports = app;