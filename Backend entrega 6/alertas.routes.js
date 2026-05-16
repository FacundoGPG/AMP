const verificarRol = require('../util/verificarRol');

router.get(
    "/alertas",
    verificarRol(["Empleado", "Administrador"]),
    alertasController.getAllAlertas
);