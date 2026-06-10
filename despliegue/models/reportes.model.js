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