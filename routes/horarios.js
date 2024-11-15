const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

router.post('/save-hours', horarioController.saveHours);
router.get('/get-hours', horarioController.getHours);
router.get('/get-hours-prof', horarioController.getHoursByProfessional);

module.exports = router;
