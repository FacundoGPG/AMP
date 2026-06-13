const express = require("express");
const router = express.Router();
const buzonController = require("../controllers/buzon.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento", "Auditoria"];

router.get("/buzon", isAuth, verificarRol(ROLES_ADMIN), buzonController.renderBuzon);
router.get("/api/buzon", isAuth, verificarRol(ROLES_ADMIN), buzonController.getBuzon);
router.get("/api/buzon/contadores", isAuth, verificarRol(ROLES_ADMIN), buzonController.getContadores);
router.get("/api/buzon/usuarios", isAuth, verificarRol(ROLES_ADMIN), buzonController.getUsuarios);  
router.get("/api/buzon/:id", isAuth, verificarRol(ROLES_ADMIN), buzonController.getBuzonById);      
router.put("/api/buzon/:id", isAuth, verificarRol(["Administrador", "Oficial_Cumplimiento"]), buzonController.updateBuzon);

module.exports = router;