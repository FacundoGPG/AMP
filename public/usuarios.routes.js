const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const controllerUsuarios = require('../controllers/usuarios.controller');

router.get("/health", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ status: "ok Usuarios" });
    res.end();
});

router.get("/obtener_usuarios", controllerUsuarios.getAllUsers);
router.get("/obtener_usuarios_activos", controllerUsuarios.getAllUsersActivos);
router.get("/agregar_usuario", controllerUsuarios.addUserView);
router.post("/agregar_usuario", controllerUsuarios.addUserForm);
router.get("/editar_usuario", controllerUsuarios.editUserView);
router.post("/editar_usuario", controllerUsuarios.editUserForm);
router.post("/eliminar_usuario", controllerUsuarios.deleteUser);

module.exports = router;