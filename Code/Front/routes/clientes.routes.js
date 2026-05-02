const express = require("express");
const router = express.Router();
const clientesController = require("../controllers/clientes.controller");

router.get("/clientes", clientesController.renderClientes);

module.exports = router;
