# Quick Start Guide

Get your Fuel Tracker API up and running in 5 minutes!

## 1. Setup Environment

```bash
# Copy the example environment file
cp .env.example .env
```

## 2. Configure Database

Edit `.env` and set your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fuel_tracker
DB_USER=postgres
DB_PASSWORD=your_actual_password
```

## 3. Create Database

Connect to PostgreSQL and create the database:
```sql
CREATE DATABASE fuel_tracker;
```

Or using psql:
```bash
psql -U postgres -c "CREATE DATABASE fuel_tracker;"
```

## 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 5. Test the API

Open your browser or use curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Welcome message
curl http://localhost:3000/
```

## 6. Expected Output

Health check should return:
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

## Troubleshooting

### Database Connection Failed
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure database `fuel_tracker` exists
- Check if PostgreSQL is accepting connections on port 5432

### Port Already in Use
Change the PORT in `.env`:
```env
PORT=3001
```

### Permission Denied
Ensure you have write permissions for the `logs` directory.

## Next Steps

- Add new routes in `src/routes/`
- Create controllers in `src/controllers/`
- Implement business logic in `src/services/`
- Add database queries in `src/repositories/`
- See `README.md` for detailed documentation