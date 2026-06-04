// routes/reportes.routes.js
const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportes.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento"];

router.get("/", isAuth, verificarRol(ROLES_ADMIN), reportesController.renderReportes);
router.post("/crear", isAuth, verificarRol(ROLES_ADMIN), reportesController.crearReporte);
router.post("/eliminar/:id", isAuth, verificarRol(ROLES_ADMIN), reportesController.eliminarReporte);
// Exportaciones deshabilitadas temporalmente.
// router.get("/exportar/csv", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarCSV);
// router.get("/exportar/pdf", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarPDF);

module.exports = router;
