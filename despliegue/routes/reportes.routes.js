const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportes.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento", "Auditoria"];
const ROLES_ESCRITURA = ["Administrador", "Oficial_Cumplimiento"];

router.get("/", isAuth, verificarRol(ROLES_ADMIN), reportesController.get_reportes);
router.post("/crear", isAuth, verificarRol(ROLES_ESCRITURA), reportesController.post_crear);
router.post("/eliminar/:id", isAuth, verificarRol(ROLES_ESCRITURA), reportesController.delete_reporte);
router.post("/enviar/:id", isAuth, verificarRol(ROLES_ESCRITURA), reportesController.enviarReporte);
router.get("/estatus/:id", isAuth, verificarRol(ROLES_ADMIN), reportesController.getEstatusReporte);
router.post("/estatus/:id", isAuth, verificarRol(ROLES_ESCRITURA), reportesController.actualizarEstatus);
router.get("/exportar/xml", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarXML);
router.get("/exportar/txt", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarTXT);
router.get("/exportar/csv", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarCSV);
router.get("/exportar/pdf", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarPDF);

module.exports = router;