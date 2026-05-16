const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportes.controller");

router.get("/reportes", reportesController.renderReportes);

module.exports = router;
