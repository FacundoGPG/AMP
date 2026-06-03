const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Oficial_Cumplimiento", "Administrador"];

router.get("/", (req, res) => res.redirect("/dashboard"));
router.get("/dashboard", isAuth, verificarRol(ROLES_ADMIN), dashboardController.renderDashboard);

module.exports = router;