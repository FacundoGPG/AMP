const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const model = require('../models/usuarios.model.js');
const modelAlertas = require('../models/alertas.model.js');

module.exports.getAllUsers = async(req, res) => {

    let correo = "";
    let contrasena = "";

    let usuarios = model.ObtenerUsuariosActivos(correo, contrasena);
    let alertas = modelAlertas.ObtenerAlertas();

    res.render('./', {
        title: "Obtener Usuarios",
        usuarios: usuarios,
        alertas: alertas
    });
}

module.exports.getAllUsersActivos = async(req, res) => {
    res.status(200).json({ status: "success" });
}

module.exports.addUserView = async(req, res) => {
    res.status(200).json({ status: "success" });
}

module.exports.addUserForm = async(req, res) => {
    res.status(200).json({ status: "success" });
}

module.exports.editUserView = async(req, res) => {
    res.status(200).json({ status: "success" });
}

module.exports.editUserForm = async(req, res) => {
    res.status(200).json({ status: "success" });
}

module.exports.deleteUser = async(req, res) => {
    res.status(200).json({ status: "success" });
}

// A partir de aqui es de autenticacion
const bcrypt = require('bcrypt');

module.exports.render_login = async(req, res) => {

    res.render("login", {
        csrfToken: res.locals.csrfToken
    });
}

module.exports.do_login = async(req, res) => {

    console.log("SÍ ENTRÓ AL LOGIN");
    console.log("BODY:", req.body);

    try {
        const Correo = req.body.Correo || req.body.username;
        const Contrasena = req.body.Contrasena || req.body.password;

        console.log("CORREO A BUSCAR:", Correo);
        const usuario = await model.User.findByCorreo(Correo);

  

        console.log("USUARIO:", usuario);

        if (!usuario) {

            console.log("Usuario no encontrado");
            return res.redirect("/");
        }

        const doMatch = await bcrypt.compare(
            Contrasena,
            usuario.Contrasena
        );

        console.log("PASSWORD:", doMatch);

        if (!doMatch) {

            console.log("Contraseña incorrecta");
            return res.redirect("/");
        }

        // AQUI ES PARA ROLES

        req.session.usuario = {
            id: usuario.ID_Usuario,
            correo: usuario.Correo,
            nombre: usuario.Nombre,
            apellido: usuario.Apellido,
            rol: usuario.rol || "Cliente"
        };

        req.session.Correo = usuario.Correo;
        req.session.isLoggedIn = true;

        // AQUI TERMINA ROLES

        console.log("ROL DEL USUARIO:", req.session.usuario.rol);
        console.log("REDIRIGIENDO A DASHBOARD");

        const rol = req.session.usuario.rol;

        if (rol === 'Cliente' || rol === 'Empleado') {
            return res.redirect("/testing");
        }

        return res.redirect("/dashboard");
        
    } catch(e) {

        console.error(e);
        return res.redirect("/");
    }
}

module.exports.get_logged = async (req, res) => {

    const usuario = await model.User.findByCorreo(req.session.Correo);

    if (!usuario) return res.redirect("/");


    res.render("usuarios/logged", {
        user: usuario,
        usuarioSesion: req.session.usuario
    });

};


module.exports.get_registro = (req, res) => {
    res.render('usuarios/registro', { 
        registro: true,
        csrfToken: req.csrfToken ? req.csrfToken() : res.locals.csrfToken
    });
};


module.exports.post_registro = async (req, res) => {

    try {

        console.log("BODY REGISTRO:", req.body);

        const Nombre = req.body.Nombre || req.body.name;
        const Apellido = req.body.Apellido || req.body.apellido || "";
        const Correo = req.body.Correo || req.body.username;
        const Contrasena = req.body.Contrasena || req.body.password;

        const user = new model.User(
            Nombre,
            Apellido,
            Correo,
            Contrasena
        );

        await user.save();

        res.status(201).redirect('/');

    } catch (e) {

        console.error(e);
        res.status(500).send('Error registrando usuario');
    }
};