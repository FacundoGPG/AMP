const express = require("express");
const router = express.Router();
const casosController = require("../controllers/casos.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_OFICIAL = ["Oficial_Cumplimiento"];
const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento", "Auditoria"];

router.get("/casos", isAuth, verificarRol(ROLES_ADMIN), casosController.renderCasos);
router.get("/api/casos", isAuth, verificarRol(ROLES_ADMIN), casosController.getCasos);
router.get("/api/casos/oficiales", isAuth, verificarRol(ROLES_ADMIN), casosController.getOficiales);
router.get("/api/casos/:id", isAuth, verificarRol(ROLES_ADMIN), casosController.getCasoById);
router.post("/api/casos", isAuth, verificarRol(ROLES_OFICIAL), casosController.createCaso);
router.post("/api/casos/:id/estatus", isAuth, verificarRol(ROLES_OFICIAL), casosController.updateEstatus);
router.post("/api/casos/:id/comentario", isAuth, verificarRol(ROLES_OFICIAL), casosController.addComentario);
router.post("/api/casos/:id/alerta", isAuth, verificarRol(ROLES_OFICIAL), casosController.addAlerta);

module.exports = router;