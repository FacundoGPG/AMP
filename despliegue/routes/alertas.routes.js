const express = require("express");
const router = express.Router();
const alertasController = require("../controllers/alertas.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento"];

router.get("/alertas", isAuth, verificarRol(ROLES_ADMIN), alertasController.renderAlertas);

module.exports = router;