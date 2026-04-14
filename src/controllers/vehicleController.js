const { query } = require('../config/database');

// @desc    Get all vehicles for current user
// @route   GET /api/vehicles
const getVehicles = async (req, res) => {
  try {
    const result = await query('SELECT * FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching vehicles' });
  }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
const createVehicle = async (req, res) => {
  const { make, model, year, fuel_type, license_plate } = req.body;
  try {
    const result = await query(
      'INSERT INTO vehicles (user_id, make, model, year, fuel_type, license_plate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, make, model, year, fuel_type, license_plate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error creating vehicle' });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
  try {
    const result = await query('DELETE FROM vehicles WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found or not authorized' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during vehicle deletion' });
  }
};

module.exports = {
  getVehicles,
  createVehicle,
  deleteVehicle
};
