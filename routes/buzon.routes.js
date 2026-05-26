const express = require("express");
const router = express.Router();
const buzonController = require("../controllers/buzon.controller");

router.get("/buzon", buzonController.renderBuzon);

module.exports = router;
