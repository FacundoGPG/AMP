const express = require("express");
const router = express.Router();
const clientesController = require("../controllers/clientes.controller");
const isAuth = require("../config/is-auth");
const verificarRol = require("../config/verificarRol");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento"];

router.get("/clientes", isAuth, verificarRol(ROLES_ADMIN), clientesController.renderClientes);
router.get("/api/clientes", isAuth, verificarRol(ROLES_ADMIN), clientesController.getClientes);
router.get("/api/clientes/bloqueados", isAuth, verificarRol(ROLES_ADMIN), clientesController.getClientesBloqueados);

module.exports = router;