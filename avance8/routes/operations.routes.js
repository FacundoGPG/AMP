const express = require("express");
const router = express.Router();
const operationsController = require("../controllers/operations.controller");

router.get("/operations", operationsController.renderOperations);
router.get("/operaciones", (req, res) => res.redirect("/operations"));
router.get("/api/operaciones", operationsController.getOperaciones);

module.exports = router;
