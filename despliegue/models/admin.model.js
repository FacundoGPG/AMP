const pool = require("../config/database");
const bcrypt = require("bcrypt");

// Roles que cada rol puede crear
const ROLES_PERMITIDOS_POR_ROL = {
  Administrador:        ["Oficial_Cumplimiento", "Auditoria", "Cliente", "Empleado"],
  Oficial_Cumplimiento: ["Cliente", "Empleado"]
};

// Obtener todos los usuarios con sus roles
exports.getUsuarios = async () => {
  const result = await pool.query(`
    SELECT
      u.id_usuario AS id,
      u.nombre,
      u.apellido,
      u.correo,
      ARRAY_AGG(r.nombre) FILTER (WHERE r.nombre IS NOT NULL) AS roles
    FROM public."Usuario" u
    LEFT JOIN public."Usuario_Rol" ur ON ur.id_usuario = u.id_usuario
    LEFT JOIN public."Rol" r          ON r.id_rol = ur.id_rol
    GROUP BY u.id_usuario
    ORDER BY u.nombre ASC
  `);
  return result.rows;
};

// Obtener un usuario por id
exports.getUsuarioById = async (id) => {
  const result = await pool.query(`
    SELECT
      u.id_usuario AS id,
      u.nombre,
      u.apellido,
      u.correo,
      ARRAY_AGG(r.nombre) FILTER (WHERE r.nombre IS NOT NULL) AS roles
    FROM public."Usuario" u
    LEFT JOIN public."Usuario_Rol" ur ON ur.id_usuario = u.id_usuario
    LEFT JOIN public."Rol" r          ON r.id_rol = ur.id_rol
    WHERE u.id_usuario = $1
    GROUP BY u.id_usuario
  `, [id]);
  return result.rows[0];
};

// Crear usuario y asignarle un rol
exports.crearUsuario = async ({ nombre, apellido, correo, contrasena, rol }) => {
  const hashedPass = await bcrypt.hash(contrasena, 12);

  const { rows } = await pool.query(`
    INSERT INTO public."Usuario" (nombre, apellido, correo, contrasena)
    VALUES ($1, $2, $3, $4)
    RETURNING id_usuario
  `, [nombre, apellido, correo, hashedPass]);

  const idUsuario = rows[0].id_usuario;

  await pool.query(`
    INSERT INTO public."Usuario_Rol" (id_usuario, id_rol)
    SELECT $1, id_rol FROM public."Rol" WHERE nombre = $2
  `, [idUsuario, rol]);

  return idUsuario;
};

// Editar nombre, apellido y rol de un usuario
exports.editarUsuario = async (id, { nombre, apellido, rol }) => {
  await pool.query(`
    UPDATE public."Usuario"
    SET nombre = $1, apellido = $2
    WHERE id_usuario = $3
  `, [nombre, apellido, id]);

  // Reemplazar el rol completamente
  await pool.query(`DELETE FROM public."Usuario_Rol" WHERE id_usuario = $1`, [id]);

  await pool.query(`
    INSERT INTO public."Usuario_Rol" (id_usuario, id_rol)
    SELECT $1, id_rol FROM public."Rol" WHERE nombre = $2
  `, [id, rol]);
};

// Eliminar usuario (CASCADE borra sus roles automáticamente por el esquema)
exports.eliminarUsuario = async (id) => {
  await pool.query(`DELETE FROM public."Usuario" WHERE id_usuario = $1`, [id]);
};

exports.ROLES_PERMITIDOS_POR_ROL = ROLES_PERMITIDOS_POR_ROL;