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
router.get("/exportar/csv", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarCSV);
router.get("/exportar/pdf", isAuth, verificarRol(ROLES_ADMIN), reportesController.exportarPDF);

module.exports = router;