const pool = require("../config/database");
exports.getResumen = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM public."Cliente") AS total_clientes,
      (SELECT COUNT(*) FROM public."Operacion" WHERE estado = 'En_Revision') AS operaciones_revision,
      (SELECT COUNT(*) FROM public."Alerta") AS total_alertas,
      (SELECT COUNT(*) FROM public."Reporte") AS total_reportes
  `);

  return result.rows[0];
};

exports.getPersonasBloqueadas = async () => {
  const result = await pool.query(`
    SELECT nombre, fecha_bloqueo
    FROM public."Cliente"
    WHERE estatus = 'Bloqueado'
    ORDER BY fecha_bloqueo DESC NULLS LAST
    LIMIT 5
  `);
  return result.rows;
};

exports.getAlertasRecientes = async () => {
  const result = await pool.query(`
    SELECT
      a.motivo,
      a.prioridad,
      a.fecha_generacion,
      COALESCE(cl.nombre, 'Sin cliente') AS cliente
    FROM public."Alerta" a
    LEFT JOIN public."Alerta_Automatica" aa ON aa.id_alerta = a.id_alerta
    LEFT JOIN public."Operacion" op        ON op.id_operacion = aa.id_operacion
    LEFT JOIN public."Contrato" co         ON co.id_contrato = op.id_contrato
    LEFT JOIN public."Cliente" cl          ON cl.id_cliente = co.id_cliente
    ORDER BY a.fecha_generacion DESC
    LIMIT 5
  `);
  return result.rows;
};


exports.getOperacionesRecientes = async () => {
  const result = await pool.query(`
    SELECT
      o.id_operacion,
      c.nombre AS cliente,
      p.nombre AS producto,
      o.monto,
      o.estado,
      CASE 
        WHEN MAX(a.prioridad) = 'Alta'  THEN 'Alto'
        WHEN MAX(a.prioridad) = 'Media' THEN 'Medio'
        WHEN MAX(a.prioridad) = 'Baja'  THEN 'Bajo'
        ELSE 'Sin evaluar'
      END AS riesgo
    FROM public."Operacion" o
    JOIN public."Contrato" ct        ON ct.id_contrato = o.id_contrato
    JOIN public."Cliente" c          ON c.id_cliente = ct.id_cliente
    JOIN public."Producto" p         ON p.id_producto = ct.id_producto
    LEFT JOIN public."Alerta_Automatica" aa ON aa.id_operacion = o.id_operacion
    LEFT JOIN public."Alerta" a      ON a.id_alerta = aa.id_alerta
    GROUP BY o.id_operacion, c.nombre, p.nombre, o.monto, o.estado
    ORDER BY o.id_operacion DESC
    LIMIT 5
  `);
  return result.rows;
};