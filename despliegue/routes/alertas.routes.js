const express = require("express");
const router = express.Router();
const alertasController = require("../controllers/alertas.controller");
const verificarRol = require("../config/verificarRol");

router.get("/alertas", alertasController.renderAlertas);

/*
router.get(
    "/alertas",
    verificarRol(["Empleado", "Administrador"]),
    alertasController.getAllAlertas
);
*/
module.exports = router;

