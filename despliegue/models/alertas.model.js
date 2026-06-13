const pool = require("../config/database");

exports.getAlertas = async () => {
  const result = await pool.query(`
    SELECT
      a.id_alerta,
      a.tipo_alerta,
      a.fecha_generacion,
      a.motivo,
      a.estatus,
      a.prioridad,
      COALESCE(cl.nombre, 'Sin cliente') AS cliente
    FROM public."Alerta" a
    LEFT JOIN public."Alerta_Automatica" aa
    ON
      aa.id_alerta = a.id_alerta
    LEFT JOIN public."Operacion" op
    ON
      op.ID_Operacion = aa.ID_Operacion
    LEFT JOIN "Contrato" co
    ON
      co.ID_Contrato = op.ID_Contrato
    LEFT JOIN public."Cliente" cl
    ON
      cl.ID_Cliente = co.ID_Cliente 
    ORDER BY a.fecha_generacion DESC
  `);

  return result.rows;
};

