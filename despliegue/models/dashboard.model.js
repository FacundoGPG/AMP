const pool = require("../config/database");
exports.getResumen = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM public."Cliente") AS total_clientes,
      (SELECT COUNT(*) FROM public."Operacion" WHERE estatus = 'En revisión') AS operaciones_revision,
      (SELECT COUNT(*) FROM public."Alerta") AS total_alertas,
      (SELECT COUNT(*) FROM public."Reporte") AS total_reportes
  `);

  return result.rows[0];
};
