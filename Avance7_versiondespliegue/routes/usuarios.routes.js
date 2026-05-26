const express = require('express');
const router = express.Router();
//NUEVO 
const verificarRol = require('../public/scripts/verificarRol.js');
const controllerUsuarios = require('../controllers/usuarios.controller.js');
const isAuth = require("../public/scripts/is-auth.js");

router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok Usuarios" });
});
// Solo administrador puede ver usuarios
router.get(
    "/usuarios",
    verificarRol(["Administrador"]),
    controllerUsuarios.getAllUsers
);
router.get("/obtener_usuarios", controllerUsuarios.getAllUsers);
router.get("/obtener_usuarios_activos", controllerUsuarios.getAllUsersActivos);
router.get("/agregar_usuario", controllerUsuarios.addUserView);
router.post("/agregar_usuario", controllerUsuarios.addUserForm);
router.get("/editar_usuario", controllerUsuarios.editUserView);
router.post("/editar_usuario", controllerUsuarios.editUserForm);
router.post("/eliminar_usuario", controllerUsuarios.deleteUser);

// Autenticación
router.get('/test_json', (req, res) => {
    res.status(200).json({ code: 200, msg: "Ok" });
});
router.get('/login', controllerUsuarios.render_login);
router.post('/login', controllerUsuarios.do_login);
router.get("/logged", isAuth, controllerUsuarios.get_logged);
router.get('/registro', controllerUsuarios.get_registro);
router.post('/registro', controllerUsuarios.post_registro);
router.get('/buscar_usuario', (req, res) => {});
router.post('/buscar_usuario', (req, res) => {});

module.exports = router;