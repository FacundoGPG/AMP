const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');

router.get('/', reportesController.get_reportes);
router.post('/crear', reportesController.post_crear);

module.exports = router;