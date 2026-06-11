const express = require("express");
const router = express.Router();
const historyController = require("../controllers/history.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento", "Auditoria"];

router.get("/history", isAuth, verificarRol(ROLES_ADMIN), historyController.renderHistory);
router.get("/api/historial", isAuth, verificarRol(ROLES_ADMIN), historyController.getHistorial);

module.exports = router;