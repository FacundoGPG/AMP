const model = require('../models/usuarios.model.js');
const historyModel = require("../models/history.model");
const { limpiarIntentosLogin } = require("../config/login-rate-limit");

module.exports.getAllUsers = async(req, res) => {
    try {
        const usuarios = await model.ObtenerUsuariosActivos();
        res.render('./', {
            title: "Obtener Usuarios",
            usuarios: usuarios
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send("Error al obtener usuarios");
    }
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

        limpiarIntentosLogin(req);

        // AQUI ES PARA ROLES

        req.session.usuario = {
            id:       usuario.ID_Usuario,
            correo:   usuario.Correo,
            nombre:   usuario.Nombre,
            apellido: usuario.Apellido,
            roles:    usuario.roles || []
        };

        req.session.Correo = usuario.Correo;
        req.session.isLoggedIn = true;

        await historyModel.registrarActividad(
            usuario.ID_Usuario,
            "Inicio de sesión",
            "Usuarios",
            "Activo"
        );

        return req.session.save((error) => {
            if (error) {
                console.error("Error guardando sesion:", error);
                return res.redirect("/");
            }

            console.log("ROL DEL USUARIO:", req.session.usuario.roles);

            const roles = req.session.usuario.roles || [];

            if (roles.includes("Administrador") || roles.includes("Oficial_Cumplimiento") || roles.includes("Auditoria")) {
                return res.redirect("/dashboard");
            }
            if (roles.includes("Empleado") || roles.includes("Cliente")) {
                return res.redirect("/testing");
            }
            return res.redirect("/dashboard");
        });
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
