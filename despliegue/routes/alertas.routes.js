const express = require("express");
const router = express.Router();
const alertasController = require("../controllers/alertas.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento"];

router.get("/alertas", isAuth, verificarRol(ROLES_ADMIN), alertasController.renderAlertas);
router.get("/api/alertas", isAuth, verificarRol(ROLES_ADMIN), alertasController.getAlertas);
router.get("/api/alertas/operacion/:id", isAuth, verificarRol(ROLES_ADMIN), alertasController.getAlertasByOperacion);
router.post("/api/alertas/:id/estatus", isAuth, verificarRol(ROLES_ADMIN), alertasController.updateEstatusAlerta);


module.exports = router;
