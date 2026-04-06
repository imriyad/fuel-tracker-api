const express = require('express');
const router = express.Router();
const { getStations, getStationById, createStation, updateStation, deleteStation } = require('../controllers/stationController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getStations);
router.get('/:id', getStationById);

// Protected Admin Routes
router.post('/', protect, authorize('admin', 'admin'), createStation);
router.put('/:id', protect, authorize('admin', 'admin'), updateStation);
router.delete('/:id', protect, authorize('admin', 'admin'), deleteStation);

module.exports = router;
