const express = require('express');
const router = express.Router();
const { getFuelEntries, createFuelEntry, getStats, getAdminStats } = require('../controllers/fuelEntryController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.get('/', getFuelEntries);
router.post('/', createFuelEntry);
router.get('/stats', getStats);
router.get('/admin-stats', authorize('admin'), getAdminStats);

module.exports = router;
