const express = require('express');
const router = express.Router();
const { getStations, getStationById, createStation, updateStation, deleteStation } = require('../controllers/stationController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getStations);
router.get('/:id', getStationById);

// Protected Admin Routes
router.post('/', protect, authorize('admin'), createStation);
router.put('/:id', protect, authorize('admin'), updateStation);
router.delete('/:id', protect, authorize('admin'), deleteStation);

module.exports = router;
