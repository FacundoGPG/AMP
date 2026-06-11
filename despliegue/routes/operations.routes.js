const express = require("express");
const router = express.Router();
const operationsController = require("../controllers/operations.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ESCRITURA = ["Administrador", "Oficial_Cumplimiento"];
const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento", "Auditoria"];

router.get("/operations", isAuth, verificarRol(ROLES_ADMIN), operationsController.renderOperations);
router.get("/operaciones", (req, res) => res.redirect("/operations"));
router.get("/api/operaciones", isAuth, verificarRol(ROLES_ADMIN), operationsController.getOperaciones);
router.get("/api/operaciones/perfil", isAuth, verificarRol(ROLES_ADMIN), operationsController.getPerfilTransaccional);
router.get("/api/operaciones/clientes/:id", isAuth, verificarRol(ROLES_ADMIN), operationsController.getOperaciones)
router.post("/api/operaciones", isAuth, verificarRol(ROLES_ESCRITURA), operationsController.createOperacion);


module.exports = router;
