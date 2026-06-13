const express = require("express");
const router = express.Router();
const controller = require("../controllers/chisme.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento"];
const ROLES_TODOS = ["Administrador", "Oficial_Cumplimiento", "Empleado", "Cliente"];

router.get("/testing", isAuth, verificarRol(ROLES_TODOS), controller.renderChisme);
router.post("/upload_file", isAuth, verificarRol(ROLES_TODOS), controller.upload_file);
router.post("/upload_file_private", isAuth, verificarRol(ROLES_TODOS), controller.upload_file_private);
router.get("/get_private_file/:file", isAuth, verificarRol(ROLES_ADMIN), controller.get_private_file);
router.post("/api/documentos/upload", isAuth, verificarRol(ROLES_TODOS), controller.upload_documento_cliente);

module.exports = router;
