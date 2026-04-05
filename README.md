# Fuel Tracker API

A production-ready Express backend with clean architecture, environment configuration, and PostgreSQL connection.

## Features

- ✅ Clean Architecture (Controllers, Services, Repositories, Routes)
- ✅ PostgreSQL database with connection pooling
- ✅ Environment configuration with dotenv
- ✅ Comprehensive logging with Winston
- ✅ Security middleware (Helmet, CORS)
- ✅ Error handling middleware
- ✅ Health check endpoint
- ✅ Graceful shutdown handling
- ✅ Request logging with Morgan
- ✅ Async error handling
- ✅ Production-ready configuration

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fuel-tracker-api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fuel_tracker
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_SSL=false

# Logging
LOG_LEVEL=info
```

5. Create a PostgreSQL database:
```sql
CREATE DATABASE fuel_tracker;
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for auto-reloading.

### Production Mode
```bash
npm start
```

## Project Structure

```
fuel-tracker-api/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # PostgreSQL connection pool
│   │   └── logger.js     # Winston logger configuration
│   ├── controllers/      # Route controllers
│   │   └── healthController.js
│   ├── middlewares/      # Express middlewares
│   │   └── errorHandler.js
│   ├── repositories/     # Data access layer
│   ├── routes/           # API routes
│   │   └── healthRoutes.js
│   ├── services/         # Business logic layer
│   ├── utils/            # Utility functions
│   ├── app.js            # Express app configuration
│   └── server.js         # Server entry point
├── logs/                 # Log files (auto-generated)
├── .env                  # Environment variables (not in git)
├── .env.example          # Example environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
└── README.md            # This file
```

## API Endpoints

### Health Check
```
GET /api/health
```

Returns the health status of the API and database connection.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-04-04T21:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "database": {
    "status": "connected",
    "message": "Database connection successful"
  },
  "version": "1.0.0"
}
```

### Welcome
```
GET /
```

Returns a welcome message with API information.

## Database Configuration

The application uses a connection pool to manage PostgreSQL connections efficiently:

- **Max connections**: 20
- **Idle timeout**: 30 seconds
- **Connection timeout**: 2 seconds

The database configuration is in `src/config/database.js`.

## Logging

The application uses Winston for logging with the following features:

- Console logging (colorized in development)
- File logging (error.log for errors, combined.log for all logs)
- Log rotation (5MB max file size, 5 files max)
- Structured logging with timestamps
- HTTP request logging with Morgan

Logs are stored in the `logs/` directory.

## Error Handling

The application has comprehensive error handling:

- Custom `ApiError` class for operational errors
- Error conversion middleware for unhandled errors
- Global error handler with appropriate responses
- Different error responses for development vs production
- Automatic error logging

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate limiting**: Can be added (optional)
- **Input validation**: Can be added (optional)
- **SQL injection prevention**: Using parameterized queries

## Graceful Shutdown

The application handles graceful shutdown on:

- `SIGTERM` signal
- `SIGINT` signal (Ctrl+C)

The shutdown process:
1. Stops accepting new connections
2. Closes existing connections
3. Closes database pool
4. Exits the process

## Development

### Adding New Routes

1. Create a controller in `src/controllers/`
2. Create routes in `src/routes/`
3. Import and use the routes in `src/app.js`

Example:
```javascript
// src/routes/exampleRoutes.js
const express = require('express');
const router = express.Router();
const { exampleController } = require('../controllers/exampleController');

router.get('/', exampleController.getExamples);
router.post('/', exampleController.createExample);

module.exports = router;
```

### Adding New Middleware

Create middleware in `src/middlewares/` and use it in `src/app.js`:

```javascript
const exampleMiddleware = require('./middlewares/exampleMiddleware');

app.use(exampleMiddleware);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 3000 |
| HOST | Server host | localhost |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | fuel_tracker |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| DB_SSL | Use SSL for database | false |
| LOG_LEVEL | Logging level | info |

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start src/server.js --name fuel-tracker-api
```
3. Configure CORS origin for your frontend domain
4. Set up SSL/TLS (use Nginx or similar)
5. Configure database connection for production
6. Set up log rotation and monitoring

## Testing

To test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

## License

ISC

## Support

For issues and questions, please open an issue in the repository.