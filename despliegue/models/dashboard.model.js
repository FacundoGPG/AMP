const pool = require("../config/database");

exports.getTotalAlertasActivas = async () => {
  const result = await pool.query(`
    SELECT COUNT(*)::int AS alertas_activas
    FROM public."Alerta"
    WHERE estatus IN ('Abierta', 'En revisión')
  `);

  return result.rows[0].alertas_activas;
};

exports.getTotalAlertasActivas = async () => {
  const result = await pool.query(`
    SELECT COUNT(*)::int AS total
    FROM public."Alerta"
    WHERE estatus IN ('Abierta', 'En revisión')
  `);

  return result.rows[0].total;
};

exports.getTotalOperacionesEnRevision = async () => {
  const result = await pool.query(`
    SELECT COUNT(*)::int AS total
    FROM public."Operacion"
    WHERE estado = 'En revisión'
  `);

  return result.rows[0].total;
};

exports.getTotalCasosResueltos = async () => {
  const result = await pool.query(`
    SELECT COUNT(*)::int AS total
    FROM public."Alerta"
    WHERE estatus = 'Resuelta'
  `);

  return result.rows[0].total;
};

exports.getResumen = async () => {
  const [
    totalReportes,
    alertasActivas,
    operacionesEnRevision,
    casosResueltos
  ] = await Promise.all([
    exports.getTotalAlertasActivas(),
    exports.getTotalOperacionesEnRevision(),
    exports.getTotalCasosResueltos()
  ]);

  return {
    totalReportes,
    alertasActivas,
    operacionesEnRevision,
    casosResueltos
  };
};