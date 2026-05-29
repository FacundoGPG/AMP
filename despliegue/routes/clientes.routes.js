const express = require("express");
const router = express.Router();
const clientesController = require("../controllers/clientes.controller");

router.get("/clientes", clientesController.renderClientes);
router.get("/api/clientes", clientesController.getClientes);
router.get("/api/clientes/bloqueados", clientesController.getClientesBloqueados);

module.exports = router;
