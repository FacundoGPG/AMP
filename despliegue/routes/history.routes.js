const express = require("express");
const router = express.Router();
const historyController = require("../controllers/history.controller");

router.get("/history", historyController.renderHistory);
router.get("/api/historial", historyController.getHistorial);

module.exports = router;