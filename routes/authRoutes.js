const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('google-auth-library');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/save-area', authController.saveArea);
router.post('/get-area', authController.getArea);
router.post('/save-descripcion', authController.saveDesc);
router.post('/get-descripcion', authController.getDesc);
router.post('/save-precio', authController.savePrecio);
router.post('/get-precio', authController.getPrecio);
router.post('/save-direccion', authController.saveDirec);
router.post('/get-direccion', authController.getDirec);
router.post('/get-calenID', authController.getCalenID)

module.exports = router;
