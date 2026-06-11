const express = require("express");
const router = express.Router();
const clientesController = require("../controllers/clientes.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento", "Auditoria"];
const ROLES_ESCRITURA = ["Administrador", "Oficial_Cumplimiento"];


router.get("/clientes", isAuth, verificarRol(ROLES_ADMIN), clientesController.renderClientes);
router.post("/clientes/crear", isAuth, verificarRol(ROLES_ESCRITURA), clientesController.addCliente);
router.post("/clientes/editar/:id", isAuth, verificarRol(ROLES_ESCRITURA), clientesController.updateCliente);
router.get("/api/clientes", isAuth, verificarRol(ROLES_ADMIN), clientesController.getClientes);
router.get("/api/clientes/bloqueados", isAuth, verificarRol(ROLES_ADMIN), clientesController.getClientesBloqueados);
router.get("/api/clientes/:id/documentos", isAuth, verificarRol(ROLES_ADMIN), clientesController.getDocumentos);
router.get("/api/clientes/:id/operaciones", isAuth, verificarRol(ROLES_ADMIN), clientesController.getOperacionesDeCliente);

module.exports = router;
