const pool = require("../config/database");

exports.getAlertas = async () => {
  const result = await pool.query(`
    SELECT
      id_alerta,
      id_reporte,
      tipo_alerta,
      fecha_generacion,
      motivo,
      estatus,
      prioridad
    FROM public."Alerta"
    ORDER BY fecha_generacion DESC
  `);

  return result.rows;
};

