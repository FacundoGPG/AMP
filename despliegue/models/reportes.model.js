const pool=require("../config/database");

const sqlReportes = `
  SELECT *
  FROM public."Reporte"
  ORDER BY fecha_generacion DESC
`;

const sqlCrearReporte = `
  INSERT INTO public."Reporte"
  (
    id_reporte,
    tipo,
    fecha_generacion,
    estatus_envio
  )
  VALUES
  (
    $1,
    $2,
    NOW(),
    'Pendiente'
  )
`;

const sqlEnviarReporte = `
  UPDATE public."Reporte"
  SET
    estatus_envio = 'Enviado',
    fecha_envio = NOW()
  WHERE id_reporte = $1
`;

const sqlEstatusReporte = `
  SELECT
    id_reporte,
    folio,
    estatus_envio,
    fecha_envio
  FROM public."Reporte"
  WHERE id_reporte = $1
`;

const sqlEliminarReporte = `
  DELETE FROM public."Reporte"
  WHERE id_reporte = $1
`;

const sqlActualizarEstatus = `
  UPDATE public."Reporte"
  SET estatus_envio = $1
  WHERE id_reporte = $2
`;

const sqlBuscarReporte = `
  SELECT *
  FROM public."Reporte"
  WHERE id_reporte = $1
`;
exports.getReportes=async ()=>{
    const result=await pool.query(sqlReportes);
    return result.rows;
};

exports.crearReporte=async(tipo)=>{
    await pool.query(sqlCrearReporte, [
        Math.floor(Math.random()*100000), //generar un numero entre 0 y 99999
        tipo
    ]);
};

exports.enviarReporte=async(id)=>{
    await pool.query(sqlEnviarReporte,[id]);
};

exports.getEstatusReporte = async (id) => {
  const result = await pool.query(sqlEstatusReporte, [id]);
  return result.rows[0]; //regresa el primer registro
};
exports.EliminarReporte=async(id)=>{
    await pool.query(sqlEliminarReporte, [id]);
};
exports.ActualizarEstatus=async(id, estatus_envio)=>{
    await pool.query(sqlActualizarEstatus, [estatus_envio, id]);
    const result = await pool.query(sqlBuscarReporte, [id]);
    return result.rows[0]
};
