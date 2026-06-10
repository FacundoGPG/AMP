const pool = require("../config/database");

exports.getReportes = async () => {
  const sql = `
    SELECT
      id_reporte,
      tipo,
      fecha_generacion,
      estatus_envio,
      titulo,
      prioridad
    FROM public."Reporte"
    ORDER BY fecha_generacion DESC
  `;
  const result = await pool.query(sql);
  return result.rows;
};

exports.createReporte = async ({ id_reporte, tipo, titulo, prioridad }) => {
  const sql = `
    INSERT INTO public."Reporte"
    (id_reporte, tipo, fecha_generacion, estatus_envio, titulo, prioridad)
    VALUES ($1, $2, NOW(), 'Pendiente', $3, $4)
    RETURNING *
  `;
  const result = await pool.query(sql, [id_reporte, tipo, titulo || null, prioridad || null]);
  return result.rows[0];
};

exports.enviarReporte = async (id_reporte) => {
  const sql = `
    UPDATE public."Reporte"
    SET estatus_envio = 'Enviado'
    WHERE id_reporte = $1
    RETURNING *
  `;
  const result = await pool.query(sql, [id_reporte]);
  return result.rows[0];
};

exports.getEstatusReporte = async (id_reporte) => {
  const sql = `
    SELECT id_reporte, estatus_envio
    FROM public."Reporte"
    WHERE id_reporte = $1
  `;
  const result = await pool.query(sql, [id_reporte]);
  return result.rows[0];
};

exports.deleteReporte = async (id_reporte) => {
  const sql = `
    DELETE FROM public."Reporte"
    WHERE id_reporte = $1
  `;
  await pool.query(sql, [id_reporte]);
};

exports.actualizarEstatus = async (id_reporte, estatus_envio) => {
  const sql = `
    UPDATE public."Reporte"
    SET estatus_envio = $1
    WHERE id_reporte = $2
    RETURNING *
  `;
  const result = await pool.query(sql, [estatus_envio, id_reporte]);
  return result.rows[0];
};

exports.getReporteById = async (id_reporte) => {
  const sql = `
    SELECT *
    FROM public."Reporte"
    WHERE id_reporte = $1
  `;
  const result = await pool.query(sql, [id_reporte]);
  return result.rows[0];
};