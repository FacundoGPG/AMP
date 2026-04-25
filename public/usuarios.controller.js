/* backend david*/
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const modelUsuarios = require('../models/usuarios.model');
const modelAlertas = require('../models/alertas.model');

module.exports.getAllUsers = async(req, res) => {
    let correo = "";
    let contrasena = "";

    let usuarios = modelUsuarios.ObtenerUsuariosActivos(correo, contrasena);
    let alertas = modelAlertas.ObtenerAlertas();

    /*res.setHeader("Content-Type", "application/json");
    res.status(200)
        .json({ status: "success",
                message:"Get all users",
                data: activeUsers
            });
    res.end();*/

    res.render("./usuarios/obtener_usuarios",{
        title: "Obtener Usuarios",
        usuarios: usuarios,
        alertas: alertas
    });
}

module.exports.getAllUsersActivos = async(req, res) => {
    res.status(200).json({ status: "success",});
}

module.exports.addUserView = async(req, res) => {
    res.status(200).json({ status: "success",});
}

module.exports.addUserForm = async(req, res) => {
    res.status(200).json({ status: "success",});
}

module.exports.editUserView = async(req, res) => {
    res.status(200).json({ status: "success",});
}

module.exports.editUserForm = async(req, res) => {
    res.status(200).json({ status: "success",});
}

module.exports.deleteUser = async(req, res) => {
    res.status(200).json({ status: "success",});
}
