const pool = require("../config/database");
 

exports.getListas = async () => {
  const sql = `
    SELECT
      id_lista,
      tipo_lista,
      nombre,
      fuente
    FROM public."Lista_Riesgo"
    ORDER BY tipo_lista ASC, nombre ASC
  `;
  const result = await pool.query(sql);
  return result.rows;
};
 

exports.getListaById = async (id_lista) => {
  const sql = `
    SELECT id_lista, tipo_lista, nombre, fuente
    FROM public."Lista_Riesgo"
    WHERE id_lista = $1
  `;
  const result = await pool.query(sql, [id_lista]);
  return result.rows[0];
};
 

exports.addLista = async ({ tipo_lista, nombre, fuente }) => {
  const sql = `
    INSERT INTO public."Lista_Riesgo" (tipo_lista, nombre, fuente)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(sql, [tipo_lista, nombre, fuente]);
  return result.rows[0];
};
 

exports.updateLista = async (id_lista, { tipo_lista, nombre, fuente }) => {
  const sql = `
    UPDATE public."Lista_Riesgo"
    SET tipo_lista = $1, nombre = $2, fuente = $3
    WHERE id_lista = $4
    RETURNING *
  `;
  const result = await pool.query(sql, [tipo_lista, nombre, fuente, id_lista]);
  return result.rows[0];
};
 

exports.deleteLista = async (id_lista) => {
  const sql = `DELETE FROM public."Lista_Riesgo" WHERE id_lista = $1`;
  await pool.query(sql, [id_lista]);
};
 
// Registrar cambio en configuracion de lista (auditoría)
exports.registrarConfiguracion = async ({ id_usuario, id_lista, tipo_accion, descripcion_cambio }) => {
  const sql = `
    INSERT INTO public."Configuracion_Lista"
    (id_usuario, id_lista, fecha_configuracion, tipo_accion, descripcion_cambio)
    VALUES ($1, $2, NOW(), $3, $4)
  `;
  await pool.query(sql, [id_usuario, id_lista, tipo_accion, descripcion_cambio]);
};
 

exports.getConfiguracionByLista = async (id_lista) => {
  const sql = `
    SELECT
      cl.fecha_configuracion,
      cl.tipo_accion,
      cl.descripcion_cambio,
      u.nombre || ' ' || u.apellido AS usuario
    FROM public."Configuracion_Lista" cl
    JOIN public."Usuario" u ON u.id_usuario = cl.id_usuario
    WHERE cl.id_lista = $1
    ORDER BY cl.fecha_configuracion DESC
  `;
  const result = await pool.query(sql, [id_lista]);
  return result.rows;
};