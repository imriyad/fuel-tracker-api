const express = require('express');
const router = express.Router();
const { getVehicles, createVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/', getVehicles);
router.post('/', createVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
