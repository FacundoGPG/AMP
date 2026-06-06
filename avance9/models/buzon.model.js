const pool = require("../config/database");

exports.getBuzon = async () => {
  const sql = `
    SELECT
      ab.id_alerta,
      a.fecha_generacion AS fecha,
      ab.estatus,
      ab.descripcion_reporte,
      ab.ruta_evidencia,
      ab.notas,
      ab.id_encargado,
      COALESCE(u.nombre || ' ' || u.apellido, 'Sin asignar') AS encargado
    FROM public."Alerta_Buzon" ab
    JOIN public."Alerta" a ON a.id_alerta = ab.id_alerta
    LEFT JOIN public."Usuario" u ON u.id_usuario = ab.id_encargado
    ORDER BY a.fecha_generacion DESC
  `;

  const result = await pool.query(sql);
  return result.rows;
};

exports.getBuzonById = async (id) => {
  const sql = `
    SELECT
      ab.id_alerta,
      a.fecha_generacion AS fecha,
      ab.estatus,
      ab.descripcion_reporte,
      ab.ruta_evidencia,
      ab.notas,
      ab.id_encargado,
      COALESCE(u.nombre || ' ' || u.apellido, 'Sin asignar') AS encargado
    FROM public."Alerta_Buzon" ab
    JOIN public."Alerta" a ON a.id_alerta = ab.id_alerta
    LEFT JOIN public."Usuario" u ON u.id_usuario = ab.id_encargado
    WHERE ab.id_alerta = $1
  `;

  const result = await pool.query(sql, [id]);
  return result.rows[0];
};

exports.getContadores = async () => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE estatus = 'Pendiente') AS pendientes,
      COUNT(*) FILTER (WHERE estatus = 'En seguimiento') AS en_seguimiento,
      COUNT(*) FILTER (WHERE estatus = 'Resuelto') AS resueltos
    FROM public."Alerta_Buzon"
  `;

  const result = await pool.query(sql);
  return result.rows[0];
};

exports.updateBuzon = async (id, estatus, idEncargado, notas) => {
  const sql = `
    UPDATE public."Alerta_Buzon"
    SET
      estatus = $1,
      id_encargado = $2,
      notas = $3
    WHERE id_alerta = $4
  `;

  await pool.query(sql, [estatus, idEncargado || null, notas, id]);
};

exports.getUsuarios = async () => {
  const sql = `
    SELECT DISTINCT 
      u.id_usuario, 
        u.nombre || ' ' || u.apellido AS nombre_completo
    FROM public."Usuario" u
    JOIN public."Usuario_Rol" ur 
    ON 
      ur.id_usuario = u.id_usuario
    JOIN public."Rol" r 
    ON 
      r.id_rol = ur.id_rol
    WHERE r.nombre IN ('Oficial_Cumplimiento', 'Administrador')
    ORDER BY nombre_completo
  `;
  const result = await pool.query(sql);
  return result.rows;
};