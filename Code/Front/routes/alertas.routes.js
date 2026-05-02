const express = require("express");
const router = express.Router();
const alertasController = require("../controllers/alertas.controller");

router.get("/alertas", alertasController.renderAlertas);

module.exports = router;
