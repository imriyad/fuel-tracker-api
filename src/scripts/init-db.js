const { query, testConnection, closePool } = require('../config/database');
const bcrypt = require('bcryptjs');

const initDb = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Could not connect to database for initialization.');
      process.exit(1);
    }

    console.log('--- Initializing Database ---');

    // Drop tables if they exist
    // await query('DROP TABLE IF EXISTS fuel_stations CASCADE;');
    // await query('DROP TABLE IF EXISTS users CASCADE;');

    // Create Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table ready.');

    // Create Fuel Stations table
    await query(`
      CREATE TABLE IF NOT EXISTS fuel_stations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        location VARCHAR(255) NOT NULL,
        fuel_type VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        availability VARCHAR(20) NOT NULL CHECK (availability IN ('In Stock', 'Low', 'Out')),
        latitude DECIMAL(9, 6),
        longitude DECIMAL(9, 6),
        map_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Fuel Stations table ready.');

    // Add some initial fuel stations
    const stationsCount = await query('SELECT COUNT(*) FROM fuel_stations;');
    if (parseInt(stationsCount.rows[0].count) === 0) {
      const initialStations = [
        ['Shell Premium Express', '124 Market St, San Francisco, CA', 'Petrol', 1.42, 'In Stock', 'https://maps.app.goo.gl/9uT2pG5m5YjGvXpD8'],
        ['BP Global Station', '455 Mission St, San Francisco, CA', 'Petrol', 1.38, 'Low', 'https://maps.app.goo.gl/9uT2pG5m5YjGvXpD8'],
        ['Chevron Central', '890 Geary Blvd, San Francisco, CA', 'Diesel', 1.45, 'In Stock', 'https://maps.app.goo.gl/9uT2pG5m5YjGvXpD8'],
        ['7-Eleven Fuel', '221 Turk St, San Francisco, CA', 'Petrol', 1.35, 'Out', 'https://maps.app.goo.gl/9uT2pG5m5YjGvXpD8']
      ];

      for (const [name, loc, type, price, avail, map_url] of initialStations) {
        await query(
          'INSERT INTO fuel_stations (name, location, fuel_type, price, availability, map_url) VALUES ($1, $2, $3, $4, $5, $6);',
          [name, loc, type, price, avail, map_url]
        );
      }
      console.log('✅ Seeded initial fuel stations.');
    }

    // Add an admin user if not exists
    const adminCount = await query("SELECT COUNT(*) FROM users WHERE role = 'admin';");
    if (parseInt(adminCount.rows[0].count) === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4);',
        ['Admin User', 'admin@example.com', hashedPassword, 'admin']
      );
      console.log('✅ Created default admin user (admin@example.com / admin123).');
    }

    console.log('--- Database Initialization Complete ---');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  } finally {
    await closePool();
    process.exit(0);
  }
};

initDb();
