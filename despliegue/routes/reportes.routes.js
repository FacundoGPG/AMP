// routes/reportes.routes.js
const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportes.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento"];

router.get("/", isAuth, verificarRol(ROLES_ADMIN), reportesController.get_reportes);
router.post("/crear", isAuth, verificarRol(ROLES_ADMIN), reportesController.post_crear);
router.post("/eliminar/:id", isAuth, verificarRol(ROLES_ADMIN), reportesController.delete_reporte);
router.get("/exportar/xml", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarXML);
router.get("/exportar/txt", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarTXT);
router.get("/exportar/csv", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarCSV);
router.get("/exportar/pdf", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarPDF);
router.post("/enviar/:id", isAuth, verificarRol(ROLES_ADMIN), reportesController.enviarReporte);
router.post("/estatus/:id", isAuth, verificarRol(ROLES_ADMIN), reportesController.getEstatusReporte);
router.post("/estatus/:id", isAuth, verificarRol(ROLES_ADMIN), reportesController.actualizarEstatus);

module.exports = router;
