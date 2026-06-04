const express = require("express");
const router = express.Router();
const controller = require("../controllers/chisme.controller");

router.get("/testing", controller.renderChisme);

/* =========================
   RUTAS archivos
========================= */
router.post("/upload_file", controller.upload_file);
router.post("/upload_file_private", controller.upload_file_private);
router.get("/get_private_file/:file", controller.get_private_file);

module.exports = router;