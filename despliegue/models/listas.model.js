const pool = require("../config/database");
 

exports.getListas = async () => {
  const sql = `
    SELECT
      id_lista,
      tipo_lista,
      nombre,
      fuente
    FROM public."Lista_Riesgo"
    ORDER BY tipo_lista ASC, nombre ASC
  `;
  const result = await pool.query(sql);
  return result.rows;
};
 

exports.getListaById = async (id_lista) => {
  const sql = `
    SELECT id_lista, tipo_lista, nombre, fuente
    FROM public."Lista_Riesgo"
    WHERE id_lista = $1
  `;
  const result = await pool.query(sql, [id_lista]);
  return result.rows[0];
};
 

exports.addLista = async ({ tipo_lista, nombre, fuente }) => {
  const existenteSql = `
    SELECT id_lista, tipo_lista, nombre, fuente
    FROM public."Lista_Riesgo"
    WHERE LOWER(nombre) = LOWER($1)
      AND tipo_lista = $2
    LIMIT 1
  `;
  const existente = await pool.query(existenteSql, [nombre, tipo_lista]);

  if (existente.rows[0]) {
    const error = new Error("La lista ya existe");
    error.code = "LISTA_DUPLICADA";
    error.lista = existente.rows[0];
    throw error;
  }

  const sql = `
    INSERT INTO public."Lista_Riesgo" (tipo_lista, nombre, fuente)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(sql, [tipo_lista, nombre, fuente]);
  return result.rows[0];
};
 
exports.findListaByNombreTipo = async ({ tipo_lista, nombre }) => {
  const sql = `
    SELECT id_lista, tipo_lista, nombre, fuente
    FROM public."Lista_Riesgo"
    WHERE LOWER(nombre) = LOWER($1)
      AND tipo_lista = $2
    LIMIT 1
  `;
  const result = await pool.query(sql, [nombre, tipo_lista]);
  return result.rows[0];
};

exports.importarListas = async ({ tipo_lista, fuente, nombres }) => {
  const importadas = [];
  const duplicadas = [];

  for (const nombre of nombres) {
    const existente = await exports.findListaByNombreTipo({ tipo_lista, nombre });

    if (existente) {
      duplicadas.push(existente);
      continue;
    }

    const lista = await exports.addLista({ tipo_lista, nombre, fuente });
    importadas.push(lista);
  }

  return { importadas, duplicadas };
};


exports.updateLista = async (id_lista, { tipo_lista, nombre, fuente }) => {
  const sql = `
    UPDATE public."Lista_Riesgo"
    SET tipo_lista = $1, nombre = $2, fuente = $3
    WHERE id_lista = $4
    RETURNING *
  `;
  const result = await pool.query(sql, [tipo_lista, nombre, fuente, id_lista]);
  return result.rows[0];
};
 

exports.deleteLista = async (id_lista, id_usuario) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const listaRes = await client.query(`
      SELECT id_lista, tipo_lista, nombre
      FROM public."Lista_Riesgo"
      WHERE id_lista = $1
    `, [id_lista]);
    const lista = listaRes.rows[0];

    if (!lista) {
      await client.query("ROLLBACK");
      return null;
    }

    const validacionesRes = await client.query(`
      SELECT
        vl.id_cliente,
        vl.resultado,
        vl.coincidencia,
        vl.fecha_validacion,
        c.nombre AS cliente
      FROM public."Validacion_Lista" vl
      LEFT JOIN public."Cliente" c ON c.id_cliente = vl.id_cliente
      WHERE vl.id_lista = $1
      ORDER BY vl.fecha_validacion DESC
    `, [id_lista]);

    for (const validacion of validacionesRes.rows) {
      await client.query(`
        INSERT INTO public."Historial" (id_usuario, actividad, modulo, estado)
        VALUES ($1, $2, 'Listas', 'Completado')
      `, [
        id_usuario,
        `Validacion archivada por eliminacion de lista ${lista.tipo_lista} - ${lista.nombre}: cliente #${validacion.id_cliente} (${validacion.cliente || "Sin nombre"}) ${validacion.resultado} / ${validacion.coincidencia}`
      ]);
    }

    await client.query(`
      INSERT INTO public."Historial" (id_usuario, actividad, modulo, estado)
      VALUES ($1, $2, 'Listas', 'Completado')
    `, [
      id_usuario,
      `Se elimino la lista "${lista.nombre}" de tipo ${lista.tipo_lista}`
    ]);

    await client.query(`DELETE FROM public."Validacion_Lista" WHERE id_lista = $1`, [id_lista]);
    await client.query(`DELETE FROM public."Configuracion_Lista" WHERE id_lista = $1`, [id_lista]);
    await client.query(`DELETE FROM public."Lista_Riesgo" WHERE id_lista = $1`, [id_lista]);

    await client.query("COMMIT");
    return lista;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
 
// Registrar cambio en configuracion de lista (auditoría)
exports.registrarConfiguracion = async ({ id_usuario, id_lista, tipo_accion, descripcion_cambio }) => {
  const sql = `
    INSERT INTO public."Configuracion_Lista"
    (id_usuario, id_lista, fecha_configuracion, tipo_accion, descripcion_cambio)
    VALUES ($1, $2, NOW(), $3, $4)
  `;
  await pool.query(sql, [id_usuario, id_lista, tipo_accion, descripcion_cambio]);
};
 

exports.getConfiguracionByLista = async (id_lista) => {
  const sql = `
    SELECT
      cl.fecha_configuracion,
      cl.tipo_accion,
      cl.descripcion_cambio,
      u.nombre || ' ' || u.apellido AS usuario
    FROM public."Configuracion_Lista" cl
    JOIN public."Usuario" u ON u.id_usuario = cl.id_usuario
    WHERE cl.id_lista = $1
    ORDER BY cl.fecha_configuracion DESC
  `;
  const result = await pool.query(sql, [id_lista]);
  return result.rows;
};
