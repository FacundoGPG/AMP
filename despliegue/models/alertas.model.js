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
//trae las listas ordenadas
exports.getAlertasByOperacion=async(id_operacion)=>{
  const result= await pool.query(`
    SELECT
      a.id_alerta,
      a.tipo_alerta,
      a.fecha_generacion,
      a.motivo,
      a.estatus,
      a.prioridad,
      aa.id_operacion,
    FROM public."Alerta" a
    JOIN public."Alerta_Automatica" aa ON aa.id_alerta=a.id_alerta
    WHERE aa.id_operacion=$1
    ORDER BY a.fecha_generacion DESC
    `, [id_operacion]);
  return result.rows;
};

exports.updateEstatusAlerta=async(id_alerta, estatus)=>{
  const result=await pool.query(`
    UPDATE public."Alerta"
    SET estatus=$1
    WHERE id_alerta=$2
    RETURNING *
  `,[id_alerta, estatus]);
  return result.rows[0];
};
//historial
//$1 se reemplaza con id_alerta
//da el historial completo
exports.getHistorialAlerta = async(id_alerta)=>{
  const result=await pool.query(`
    SELECT
      id_historial,
      id_alerta,
      estado_anterior,
      estado_nuevo,
      accion,
      usuario_responsable,
      fecha_cambio
    FROM public."Historial_Alerta"
    WHERE id_alerta=$1
    ORDER BY fecha_cambio DESC
    `,[id_alerta]);
    return result.rows;
};

