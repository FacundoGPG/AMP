const pool = require("../config/database");

// Trae todos los reportes
exports.getReportes = async () => {
  const sql = `
    SELECT
      id_reporte,
      tipo,
      fecha_generacion,
      estatus_envio,
      titulo,
      descripcion,
      prioridad
    FROM public."Reporte"
    ORDER BY fecha_generacion DESC
  `;
  const result = await pool.query(sql);
  return result.rows;
};

// Crea un reporte nuevo
exports.createReporte = async ({ id_reporte, tipo, titulo, descripcion, prioridad }) => {
  const sql = `
    INSERT INTO public."Reporte"
    (id_reporte, tipo, fecha_generacion, estatus_envio, titulo, descripcion, prioridad)
    VALUES ($1, $2, NOW(), 'Pendiente', $3, $4, $5)
    RETURNING *
  `;
  const result = await pool.query(sql, [
    id_reporte,
    tipo,
    titulo    || null,
    descripcion || null,
    prioridad || null
  ]);
  return result.rows[0];
};

// Marca un reporte como enviado
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

// Trae solo el estatus de un reporte
exports.getEstatusReporte = async (id_reporte) => {
  const sql = `
    SELECT id_reporte, estatus_envio
    FROM public."Reporte"
    WHERE id_reporte = $1
  `;
  const result = await pool.query(sql, [id_reporte]);
  return result.rows[0];
};

// Elimina un reporte
exports.deleteReporte = async (id_reporte) => {
  const sql = `
    DELETE FROM public."Reporte"
    WHERE id_reporte = $1
  `;
  await pool.query(sql, [id_reporte]);
};

// Actualiza el estatus y regresa el reporte actualizado
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

// Busca un reporte por su id
exports.getReporteById = async (id_reporte) => {
  const sql = `
    SELECT *
    FROM public."Reporte"
    WHERE id_reporte = $1
  `;
  const result = await pool.query(sql, [id_reporte]);
  return result.rows[0];
};
