const { query } = require('../config/database');

// @desc    Get all stations
// @route   GET /api/stations
const getStations = async (req, res) => {
  const { search, fuel_type, max_price } = req.query;

  let queryText = 'SELECT * FROM fuel_stations WHERE 1=1';
  let queryParams = [];
  let paramIdx = 1;

  if (search) {
    queryText += ` AND (name ILIKE $${paramIdx} OR location ILIKE $${paramIdx})`;
    queryParams.push(`%${search}%`);
    paramIdx++;
  }

  if (fuel_type) {
    queryText += ` AND fuel_type = $${paramIdx}`;
    queryParams.push(fuel_type);
    paramIdx++;
  }

  if (max_price) {
    queryText += ` AND price <= $${paramIdx}`;
    queryParams.push(max_price);
    paramIdx++;
  }

  queryText += ' ORDER BY created_at DESC';

  try {
    const result = await query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch stations error:', error.message);
    res.status(500).json({ message: 'Server error while fetching stations' });
  }
};

// @desc    Get single station
// @route   GET /api/stations/:id
const getStationById = async (req, res) => {
  try {
    const result = await query('SELECT * FROM fuel_stations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create station (Admin only)
// @route   POST /api/stations
const createStation = async (req, res) => {
  const { name, location, fuel_type, price, availability, latitude, longitude } = req.body;

  try {
    const result = await query(
      'INSERT INTO fuel_stations (name, location, fuel_type, price, availability, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, location, fuel_type, price, availability, latitude, longitude]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error creating station' });
  }
};

// @desc    Update station (Admin only)
// @route   PUT /api/stations/:id
const updateStation = async (req, res) => {
  const { name, location, fuel_type, price, availability, id } = req.body;
  const stationId = req.params.id || id;

  try {
    const result = await query(
      'UPDATE fuel_stations SET name = $1, location = $2, fuel_type = $3, price = $4, availability = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, location, fuel_type, price, availability, stationId]
    );
    if (result.rows.length === 0) {
       return res.status(404).json({ message: 'Station not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating station' });
  }
};

// @desc    Delete station (Admin only)
// @route   DELETE /api/stations/:id
const deleteStation = async (req, res) => {
  try {
    const result = await query('DELETE FROM fuel_stations WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json({ message: 'Station deleted successfully', id: req.body.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error during deletion' });
  }
};

module.exports = {
  getStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation
};
