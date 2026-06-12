const pool = require("../config/database");

exports.getCasos = async () => {
  const result = await pool.query(`
    SELECT
      c.id_caso,
      c.descripcion,
      c.estatus,
      c.fecha_apertura,
      c.fecha_cierre,
      COUNT(DISTINCT ca.id_alerta) AS total_alertas,
      STRING_AGG(DISTINCT u.nombre || ' ' || u.apellido, ', ') AS analistas
    FROM public."Caso" c
    LEFT JOIN public."Caso_Alerta" ca ON ca.id_caso = c.id_caso
    LEFT JOIN public."Usuario_Caso" uc ON uc.id_caso = c.id_caso
    LEFT JOIN public."Usuario" u ON u.id_usuario = uc.id_usuario
    GROUP BY c.id_caso
    ORDER BY c.fecha_apertura DESC
  `);
  return result.rows;
};

exports.getCasoById = async (id) => {
  const caso = await pool.query(`
    SELECT * FROM public."Caso" WHERE id_caso = $1
  `, [id]);

  const alertas = await pool.query(`
    SELECT
      a.id_alerta,
      a.tipo_alerta,
      a.motivo,
      a.estatus,
      a.prioridad,
      a.fecha_generacion
    FROM public."Caso_Alerta" ca
    JOIN public."Alerta" a ON a.id_alerta = ca.id_alerta
    WHERE ca.id_caso = $1
  `, [id]);

  const analistas = await pool.query(`
    SELECT
      uc.id_usuario,
      u.nombre || ' ' || u.apellido AS nombre,
      uc.fecha_asignacion,
      uc.estatus_atencion,
      uc.comentario
    FROM public."Usuario_Caso" uc
    JOIN public."Usuario" u ON u.id_usuario = uc.id_usuario
    WHERE uc.id_caso = $1
    ORDER BY uc.fecha_asignacion DESC
  `, [id]);

  return {
    ...caso.rows[0],
    alertas: alertas.rows,
    analistas: analistas.rows
  };
};

exports.createCaso = async (descripcion, idAlerta, idUsuario) => {
  const result = await pool.query(`
    INSERT INTO public."Caso" (descripcion, estatus, fecha_apertura)
    VALUES ($1, 'Abierto', NOW())
    RETURNING id_caso
  `, [descripcion]);

  const idCaso = result.rows[0].id_caso;

  if (idAlerta) {
    await pool.query(`
      INSERT INTO public."Caso_Alerta" (id_caso, id_alerta)
      VALUES ($1, $2)
    `, [idCaso, idAlerta]);
  }

  await pool.query(`
    INSERT INTO public."Usuario_Caso" (id_usuario, id_caso, fecha_asignacion, estatus_atencion)
    VALUES ($1, $2, NOW(), 'Asignado')
  `, [idUsuario, idCaso]);

  return idCaso;
};

exports.updateEstatus = async (id, estatus) => {
  await pool.query(`
    UPDATE public."Caso"
    SET estatus = $1
    WHERE id_caso = $2
  `, [estatus, id]);
};

exports.addComentario = async (idCaso, idUsuario, comentario) => {
  await pool.query(`
    INSERT INTO public."Usuario_Caso" (id_usuario, id_caso, fecha_asignacion, estatus_atencion, comentario)
    VALUES ($1, $2, NOW(), 'Comentario', $3)
  `, [idUsuario, idCaso, comentario]);
};

exports.addAlerta = async (idCaso, idAlerta) => {
  await pool.query(`
    INSERT INTO public."Caso_Alerta" (id_caso, id_alerta)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `, [idCaso, idAlerta]);
};

exports.getOficiales = async () => {
  const result = await pool.query(`
    SELECT u.id_usuario, u.nombre || ' ' || u.apellido AS nombre
    FROM public."Usuario" u
    JOIN public."Usuario_Rol" ur ON ur.id_usuario = u.id_usuario
    JOIN public."Rol" r ON r.id_rol = ur.id_rol
    WHERE r.nombre = 'Oficial_Cumplimiento'
    ORDER BY u.nombre
  `);
  return result.rows;
};