const express = require("express");
const router = express.Router();

const reportesController = require("../controllers/reportes.controller");

router.get("/", reportesController.get_reportes);
router.post("/crear", reportesController.post_crear);
router.post("/eliminar/:id", reportesController.delete_reporte);

//nuevas rutas
router.get("/exportar/csv", reportesController.exportarCSV);
router.get("/exportar/pdf", reportesController.exportarPDF);
module.exports = router;