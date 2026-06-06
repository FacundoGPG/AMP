const pool = require("../config/database");
const log = console.log;

exports.ObtenerUsuarios = function(correo, contrasena) {

    log("Obtener Usuarios");

    let usuarios = [];

    usuarios.push({
        id: 1,
        nombre: "Samuel",
        active: true
    });

    usuarios.push({
        id: 2,
        nombre: "Lisa",
        active: true
    });

    usuarios.push({
        id: 3,
        nombre: "Bob",
        active: false
    });

    usuarios.push({
        id: 4,
        nombre: "Alicia",
        active: true
    });

    return usuarios;
}

exports.ObtenerUsuariosActivos = function(correo, contrasena) {

    log("Obtener Usuarios");

    let usuarios = [];

    usuarios.push({
        id: 1,
        nombre: "Samuel",
        active: true
    });

    usuarios.push({
        id: 2,
        nombre: "Lisa",
        active: true
    });

    usuarios.push({
        id: 3,
        nombre: "Bob",
        active: false
    });

    usuarios.push({
        id: 4,
        nombre: "Alicia",
        active: true
    });

    let activeUsers = usuarios.filter(user => user.active);

    return activeUsers;
}

/*
    CRUD

    Create
    Read
    Update
    Delete
*/

// A partir de aqui es de autenticacion

const bcrypt = require('bcrypt');

exports.User = class {

    constructor(Nombre, Apellido, Correo, Contrasena) {
        this.Nombre = Nombre;
        this.Apellido = Apellido;
        this.Correo = Correo;
        this.Contrasena = Contrasena;
    }

    async save() {

        const hashedPass = await bcrypt.hash(this.Contrasena, 12);

        const sql = `
            INSERT INTO public."Usuario"
            (
                nombre,
                apellido,
                correo,
                contrasena
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4

            )
            RETURNING
                id_usuario,
                nombre,
                apellido,
                correo
        `;

        const { rows } = await pool.query(sql, [
            this.Nombre,
            this.Apellido,
            this.Correo,
            hashedPass
        ]);

        return rows[0];
    }

    static async findByCorreo(Correo) {

        const sql = `
            SELECT
                u.id_usuario  AS "ID_Usuario",
                u.nombre      AS "Nombre",
                u.apellido    AS "Apellido",
                u.correo      AS "Correo",
                u.contrasena  AS "Contrasena",
                ARRAY_AGG(r.nombre) AS "roles"
            FROM public."Usuario" u
            LEFT JOIN public."Usuario_Rol" ur ON ur.id_usuario = u.id_usuario
            LEFT JOIN public."Rol" r          ON r.id_rol = ur.id_rol
            WHERE u.correo = $1
            GROUP BY u.id_usuario
            LIMIT 1
        `;

        const result = await pool.query(sql, [Correo]);

        return result.rows[0];
    }
};