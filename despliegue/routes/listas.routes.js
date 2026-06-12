const express = require("express");
const router = express.Router();
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");
const controller = require("../controllers/listas.controller");
 
const ROLES_ADMIN     = ["Administrador", "Oficial_Cumplimiento"];
const ROLES_LECTURA   = ["Administrador", "Oficial_Cumplimiento", "Auditoria"];
 

router.get("/listas", isAuth, verificarRol(ROLES_LECTURA), controller.renderListas);
 

router.get("/api/listas",          isAuth, verificarRol(ROLES_LECTURA), controller.getListas);
router.post("/api/listas",         isAuth, verificarRol(ROLES_ADMIN),   controller.addLista);
router.post("/api/listas/importar-csv", isAuth, verificarRol(ROLES_ADMIN), controller.importarCsvYValidarClientes);
router.put("/api/listas/:id",      isAuth, verificarRol(ROLES_ADMIN),   controller.updateLista);
router.delete("/api/listas/:id",   isAuth, verificarRol(ROLES_ADMIN),   controller.deleteLista);
router.get("/api/listas/:id/historial", isAuth, verificarRol(ROLES_LECTURA), controller.getHistorialLista);
 
module.exports = router;
