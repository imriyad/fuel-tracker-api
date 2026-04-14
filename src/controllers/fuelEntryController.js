const { query } = require('../config/database');

// @desc    Get all fuel entries for current user
// @route   GET /api/fuel-entries
const getFuelEntries = async (req, res) => {
  try {
    const result = await query(
      `SELECT fe.*, v.make, v.model, s.name as station_name 
       FROM fuel_entries fe
       JOIN vehicles v ON fe.vehicle_id = v.id
       LEFT JOIN fuel_stations s ON fe.station_id = s.id
       WHERE fe.user_id = $1 
       ORDER BY fe.entry_date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching fuel entries' });
  }
};

// @desc    Create new fuel entry
// @route   POST /api/fuel-entries
const createFuelEntry = async (req, res) => {
  const { vehicle_id, station_id, entry_date, liters, price_per_liter, odometer } = req.body;
  const total_cost = liters * price_per_liter;

  try {
    const result = await query(
      `INSERT INTO fuel_entries (user_id, vehicle_id, station_id, entry_date, liters, price_per_liter, total_cost, odometer) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.id, vehicle_id, station_id, entry_date, liters, price_per_liter, total_cost, odometer]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error creating fuel entry' });
  }
};

// @desc    Get stats for current user
// @route   GET /api/fuel-entries/stats
const getStats = async (req, res) => {
  try {
    const totalSpent = await query('SELECT SUM(total_cost) FROM fuel_entries WHERE user_id = $1', [req.user.id]);
    const totalLiters = await query('SELECT SUM(liters) FROM fuel_entries WHERE user_id = $1', [req.user.id]);
    const entryCount = await query('SELECT COUNT(*) FROM fuel_entries WHERE user_id = $1', [req.user.id]);
    
    res.json({
      totalSpent: parseFloat(totalSpent.rows[0].sum || 0),
      totalLiters: parseFloat(totalLiters.rows[0].sum || 0),
      entryCount: parseInt(entryCount.rows[0].count),
      averagePrice: totalLiters.rows[0].sum ? (totalSpent.rows[0].sum / totalLiters.rows[0].sum) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// @desc    Get system-wide stats (Admin only)
// @route   GET /api/fuel-entries/admin-stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await query('SELECT COUNT(*) FROM users');
    const totalStations = await query('SELECT COUNT(*) FROM fuel_stations');
    const totalEntries = await query('SELECT COUNT(*) FROM fuel_entries');
    const latestEntries = await query(
      `SELECT fe.*, u.name as user_name, v.make, v.model 
       FROM fuel_entries fe 
       JOIN users u ON fe.user_id = u.id 
       JOIN vehicles v ON fe.vehicle_id = v.id 
       ORDER BY fe.created_at DESC LIMIT 5`
    );

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalStations: parseInt(totalStations.rows[0].count),
      totalEntries: parseInt(totalEntries.rows[0].count),
      latestEntries: latestEntries.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
};

module.exports = {
  getFuelEntries,
  createFuelEntry,
  getStats,
  getAdminStats
};
