const express = require("express");
const router = express.Router();
const operationsController = require("../controllers/operations.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento"];

router.get("/operations", isAuth, verificarRol(ROLES_ADMIN), operationsController.renderOperations);
router.get("/operaciones", (req, res) => res.redirect("/operations"));
router.get("/api/operaciones", isAuth, verificarRol(ROLES_ADMIN), operationsController.getOperaciones);

module.exports = router;