const express = require("express");
const router = express.Router();
const buzonController = require("../controllers/buzon.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento"];

router.get("/buzon", isAuth, verificarRol(ROLES_ADMIN), buzonController.renderBuzon);

module.exports = router;