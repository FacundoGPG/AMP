const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const isAuth = require("../config/is-auth");

router.get("/", (req, res) => res.redirect("/dashboard"));
router.get("/dashboard", dashboardController.renderDashboard);

module.exports = router;
