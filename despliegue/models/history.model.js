const pool = require("../config/database");

exports.getHistorial = async (idUsuario = null) => {
  const result = await pool.query(`
    SELECT
      h.id_historial,
      u.nombre || ' ' || u.apellido AS usuario,
      h.actividad,
      h.modulo,
      h.fecha,
      h.estado
    FROM public."Historial" h
    JOIN public."Usuario" u ON u.id_usuario = h.id_usuario
    WHERE ($1::integer IS NULL OR h.id_usuario = $1)
    ORDER BY h.fecha DESC
  `, [idUsuario]);
  return result.rows;
};

exports.registrarActividad = async (id_usuario, actividad, modulo, estado) => {
  await pool.query(`
    INSERT INTO public."Historial" (id_usuario, actividad, modulo, estado)
    VALUES ($1, $2, $3, $4)
  `, [id_usuario, actividad, modulo, estado]);
};