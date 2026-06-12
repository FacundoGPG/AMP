const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const soloAdminYOficial = verificarRol(["Administrador", "Oficial_Cumplimiento"]);
const soloAdmin = verificarRol(["Administrador"]);

router.get("/admin/usuarios", isAuth, soloAdminYOficial, adminController.getUsuarios);
router.get("/admin", isAuth, soloAdminYOficial, adminController.renderAdmin);
router.post("/admin/usuarios", isAuth, soloAdminYOficial, adminController.crearUsuario);
router.put("/admin/usuarios/:id", isAuth, soloAdminYOficial, adminController.editarUsuario);
router.delete("/admin/usuarios/:id", isAuth, soloAdminYOficial, adminController.eliminarUsuario);


module.exports = router;