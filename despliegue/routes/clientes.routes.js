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
router.get("/api/clientes/:id/umbrales", isAuth, verificarRol(ROLES_ADMIN), clientesController.getUmbralesCliente);
router.post("/api/clientes/:id/umbrales/:idUmbral", isAuth, verificarRol(ROLES_ESCRITURA), clientesController.toggleUmbralCliente);
router.get("/api/clientes/:id/contratos", isAuth, verificarRol(ROLES_ADMIN), clientesController.getContratosCliente);
router.post("/api/clientes/:id/contratos", isAuth, verificarRol(ROLES_ESCRITURA), clientesController.createContrato);
router.get("/api/productos", isAuth, verificarRol(ROLES_ADMIN), clientesController.getProductos);
router.get("/api/clientes/:id/validaciones", isAuth, verificarRol(ROLES_ADMIN), clientesController.getValidacionesCliente);
router.post("/api/clientes/:id/validar-listas", isAuth, verificarRol(ROLES_ESCRITURA), clientesController.validarClienteListas);
router.get("/api/clientes/:id/alertas", isAuth, verificarRol(ROLES_ADMIN), clientesController.getAlertasDeCliente);
router.post("/api/clientes/documentos/:id/validar", isAuth, verificarRol(ROLES_ADMIN), clientesController.validarDocumento);
router.get("/api/documentos/pendientes", isAuth, verificarRol(ROLES_ESCRITURA), clientesController.getDocumentosPendientes);
router.post("/api/documentos/:id/validar", isAuth, verificarRol(ROLES_ESCRITURA), clientesController.validarDocumentoPendiente);
router.post("/api/documentos/:id/rechazar", isAuth, verificarRol(ROLES_ESCRITURA), clientesController.rechazarDocumentoPendiente);
router.post("/api/clientes/:id/umbrales", isAuth, verificarRol(ROLES_ESCRITURA), clientesController.createUmbralPersonalizado);
router.delete("/api/clientes/:id/umbrales/:idUmbral", isAuth, verificarRol(ROLES_ESCRITURA), clientesController.deleteUmbralPersonalizado);

module.exports = router;
