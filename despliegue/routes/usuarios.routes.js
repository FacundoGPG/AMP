const express = require("express");
const router = express.Router();
const verificarRol = require("../config/verificarRol.js");
const controllerUsuarios = require("../controllers/usuarios.controller.js");
const isAuth = require("../config/is-auth.js");

const ROLES_ADMIN = ["Administrador", "Oficial_Cumplimiento"];

router.get("/health", (req, res) => res.status(200).json({ status: "ok Usuarios" }));

router.get("/usuarios", isAuth, verificarRol(ROLES_ADMIN), controllerUsuarios.getAllUsers);
router.get("/obtener_usuarios", isAuth, verificarRol(ROLES_ADMIN), controllerUsuarios.getAllUsers);
router.get("/obtener_usuarios_activos", isAuth, verificarRol(ROLES_ADMIN), controllerUsuarios.getAllUsersActivos);
router.get("/agregar_usuario", isAuth, verificarRol(ROLES_ADMIN), controllerUsuarios.addUserView);
router.post("/agregar_usuario", isAuth, verificarRol(ROLES_ADMIN), controllerUsuarios.addUserForm);
router.get("/editar_usuario", isAuth, verificarRol(ROLES_ADMIN), controllerUsuarios.editUserView);
router.post("/editar_usuario", isAuth, verificarRol(ROLES_ADMIN), controllerUsuarios.editUserForm);
router.post("/eliminar_usuario", isAuth, verificarRol(ROLES_ADMIN), controllerUsuarios.deleteUser);

// Autenticación
router.get("/test_json", (req, res) => res.status(200).json({ code: 200, msg: "Ok" }));
router.get("/login", controllerUsuarios.render_login);
router.post("/login", controllerUsuarios.do_login);
router.get("/logged", isAuth, controllerUsuarios.get_logged);
router.get("/registro", controllerUsuarios.get_registro);
router.post("/registro", controllerUsuarios.post_registro);
router.get("/buscar_usuario", (req, res) => {});
router.post("/buscar_usuario", (req, res) => {});

module.exports = router;