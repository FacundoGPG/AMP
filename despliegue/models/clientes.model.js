const pool = require("../config/database");

exports.getClientes = async () => {
  const sql = `
    SELECT
      id_cliente,
      nombre,
      tipo_persona,
      rfc,
      domicilio,
      correo,
      telefono,
      estatus,
      fecha_registro,
      motivo_bloqueo,
      fecha_bloqueo
    FROM public."Cliente"
    ORDER BY id_cliente ASC
  `;
  const result = await pool.query(sql);
  return result.rows;
};

exports.getClientesBloqueados = async () => {
  const sql = `
    SELECT
      id_cliente,
      nombre,
      tipo_persona,
      rfc,
      motivo_bloqueo,
      fecha_bloqueo
    FROM public."Cliente"
    WHERE estatus = 'Bloqueado'
    ORDER BY fecha_bloqueo DESC NULLS LAST, id_cliente ASC
  `;
  const result = await pool.query(sql);
  return result.rows;
};

exports.addCliente = async ({
  nombre,
  tipo_persona,
  rfc,
  domicilio,
  correo,
  telefono,
  estatus,
  motivo_bloqueo,
  fecha_bloqueo
}) => {
  //los $1 son parametros que protegen contra inyeccion sql
  const sql = `
    INSERT INTO public."Cliente"
      (
        nombre,
        tipo_persona,
        rfc,
        domicilio,
        correo,
        telefono,
        estatus,
        motivo_bloqueo,
        fecha_bloqueo
      )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    nombre,
    tipo_persona,
    rfc,
    domicilio,
    correo,
    telefono,
    estatus,
    motivo_bloqueo || null,
    fecha_bloqueo || null
  ];

  try {
    const result = await pool.query(sql, values);
    return result.rows[0]; 
  } catch (error) {
    if (error.code !== "23505" || error.constraint !== "pk_cliente") {
      throw error;
    }

    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('public."Cliente"', 'id_cliente'),
        COALESCE((SELECT MAX(id_cliente) FROM public."Cliente"), 1),
        true
      )
    `);

    const result = await pool.query(sql, values);
    return result.rows[0];
  }
};


exports.updateCliente = async (id_cliente, {
  nombre, 
  tipo_persona,
  rfc,
  domicilio,
  correo,
  telefono,
  estatus,
  motivo_bloqueo,
  fecha_bloqueo
}) =>{
  const sql =`
    UPDATE public."Cliente"
    SET
       nombre = $1,
       tipo_persona = $2,
       rfc = $3,
       domicilio = $4,
       correo = $5,
       telefono = $6,
       estatus = $7,
       motivo_bloqueo = $8,
       fecha_bloqueo = $9
    WHERE id_cliente = $10
    RETURNING * 
  `;

  //ID_CLIENTE PARAMETRO AL FINAL
  const values = [
    nombre,
    tipo_persona,
    rfc,
    domicilio,
    correo,
    telefono,
    estatus,
    motivo_bloqueo || null,
    fecha_bloqueo || null,
    id_cliente
  ];
  const result = await pool.query(sql, values);
  return result.rows[0];
};

//guaradar archivos que sube el usuario en la tabla de documento
exports.addDocumento = async ({
  id_cliente,
  tipo_documento,
  nombre_archivo,
  ruta_archivo
}) => {
  const sql = `
      INSERT INTO public."Documento"
      (id_cliente, tipo_documento, nombre_archivo, ruta_archivo, fecha_carga)
    VALUES ($1, $2, $3, $4, NOW())    -- NOW() pone la fecha/hora actual automáticamente
    RETURNING *
  `;

  const values = [id_cliente, tipo_documento, nombre_archivo, ruta_archivo];
  const result = await pool.query(sql, values);
  return result.rows[0];
};


exports.getDocumentosByCliente = async (id_cliente) => {
  const sql = `
    SELECT
      id_documento,
      id_cliente,
      tipo_documento,
      nombre_archivo,
      ruta_archivo,
      fecha_carga,
      estatus_validacion,
      fecha_validacion
    FROM public."Documento"
    WHERE id_cliente = $1
    ORDER BY fecha_carga DESC
  `;
  const result = await pool.query(sql, [id_cliente]);
  return result.rows;
};

exports.validarDocumento = async (id_documento, id_usuario, estatus_validacion) => {
  const sql = `
    UPDATE public."Documento"
    SET
      estatus_validacion = $1,
      id_usuario = $2,
      fecha_validacion = NOW()
    WHERE id_documento = $3
    RETURNING *
  `;
  const result = await pool.query(sql, [estatus_validacion, id_usuario, id_documento]);
  return result.rows[0];
};

exports.getOperacionesByCliente = async (id_cliente) =>{
const sql = `
  SELECT
    o.id_operacion,
    o.tipo_operacion,
    o.monto,
    o.fecha,
    o.estado,
    o.canal,
    co.id_contrato,
    co.id_producto,
    p.nombre AS producto,
    co.id_cliente,
    COUNT(DISTINCT aa.id_alerta) AS total_alertas,
    COUNT(DISTINCT ca.id_caso) AS total_casos
  FROM public."Operacion" o
  JOIN public."Contrato" co
    ON co.id_contrato = o.id_contrato
  LEFT JOIN public."Producto" p
    ON p.id_producto = co.id_producto
  LEFT JOIN public."Alerta_Automatica" aa
    ON aa.id_operacion = o.id_operacion
  LEFT JOIN public."Alerta" a
    ON a.id_alerta = aa.id_alerta
  LEFT JOIN public."Caso_Alerta" cal
    ON cal.id_alerta = a.id_alerta
  LEFT JOIN public."Caso" ca
    ON ca.id_caso = cal.id_caso
  WHERE co.id_cliente = $1
  GROUP BY
    o.id_operacion,
    o.tipo_operacion,
    o.monto,
    o.fecha,
    o.estado,
    o.canal,
    co.id_contrato,
    co.id_producto,
    p.nombre,
    co.id_cliente
  ORDER BY o.fecha DESC
`;
  const result = await pool.query(sql, [id_cliente]);
  return result.rows;
};
exports.getClientesconContratos = async(id_cliente)=>{
  const sql = `
    SELECT
      c.id_cliente,
      c.nombre,
      c.rfc,
      c.correo,
      c.telefono,
      c.domicilio,
      c.estatus,
      co.id_contrato,
      co.id_producto,
      co.fecha_inicio,
      co.fecha_fin,
      co.estatus AS estatus_contrato
    FROM public."Cliente" c
    LEFT JOIN public."Contrato" co
      ON c.id_cliente = co.id_cliente
    WHERE c.id_cliente = $1
  `;
  const result=await pool.query(sql, [id_cliente]);
  return result.rows;
};

exports.getUmbralesByCliente = async (id_cliente) => {
  const sql = `
    SELECT
      u.id_umbral,
      u.nombre,
      u.tipo_alerta,
      u.valor_limite,
      u.nivel,
      u.descripcion,
      u.es_personalizado,
      COALESCE(cu.activo, false) AS activo
    FROM public."Umbral" u
    LEFT JOIN public."Cliente_Umbral" cu
      ON cu.id_umbral = u.id_umbral
      AND cu.id_cliente = $1
    WHERE u.es_personalizado = false
       OR u.id_cliente = $1
    ORDER BY u.es_personalizado ASC, u.nivel ASC, u.nombre ASC
  `;
  const result = await pool.query(sql, [id_cliente]);
  return result.rows;
};

exports.toggleUmbral = async (id_cliente, id_umbral, activo, id_usuario) => {
  const sql = `
    INSERT INTO public."Cliente_Umbral"
      (id_cliente, id_umbral, activo, fecha_asignacion, id_usuario)
    VALUES ($1, $2, $3, NOW(), $4)
    ON CONFLICT (id_cliente, id_umbral)
    DO UPDATE SET activo = $3, id_usuario = $4
    RETURNING *
  `;
  const result = await pool.query(sql, [id_cliente, id_umbral, activo, id_usuario]);
  return result.rows[0];
};

exports.createUmbralPersonalizado = async (id_cliente, { nombre, tipo_alerta, valor_limite, nivel, descripcion }) => {
  const sql = `
    INSERT INTO public."Umbral"
      (nombre, tipo_alerta, valor_limite, nivel, descripcion, es_personalizado, id_cliente)
    VALUES ($1, $2, $3, $4, $5, true, $6)
    RETURNING *
  `;
  const result = await pool.query(sql, [nombre, tipo_alerta, valor_limite, nivel, descripcion || "", id_cliente]);
  return result.rows[0];
};

exports.deleteUmbralPersonalizado = async (id_umbral, id_cliente) => {
  await pool.query(`
    DELETE FROM public."Cliente_Umbral"
    WHERE id_umbral = $1 AND id_cliente = $2
  `, [id_umbral, id_cliente]);

  const result = await pool.query(`
    DELETE FROM public."Umbral"
    WHERE id_umbral = $1
      AND es_personalizado = true
      AND id_cliente = $2
    RETURNING id_umbral
  `, [id_umbral, id_cliente]);

  return result.rows[0];
};

exports.getContratosByCliente = async (id_cliente) => {
  const sql = `
    SELECT
      co.id_contrato,
      co.estatus,
      co.fecha_inicio,
      co.fecha_fin,
      co.saldo,
      p.nombre AS producto,
      p.tipo AS tipo_producto
    FROM public."Contrato" co
    JOIN public."Producto" p ON p.id_producto = co.id_producto
    WHERE co.id_cliente = $1
    ORDER BY co.fecha_inicio DESC
  `;
  const result = await pool.query(sql, [id_cliente]);
  return result.rows;
};

exports.createContrato = async ({ id_cliente, id_producto, fecha_inicio, fecha_fin, saldo }) => {
  const sql = `
    INSERT INTO public."Contrato"
      (id_cliente, id_producto, fecha_inicio, fecha_fin, estatus, saldo)
    VALUES ($1, $2, $3, $4, 'Activo', $5)
    RETURNING *
  `;
  const result = await pool.query(sql, [id_cliente, id_producto, fecha_inicio, fecha_fin || null, saldo]);
  return result.rows[0];
};

exports.getProductos = async () => {
  const sql = `SELECT id_producto, nombre, tipo FROM public."Producto" ORDER BY nombre ASC`;
  const result = await pool.query(sql);
  return result.rows;
};

exports.getClienteById = async (id_cliente) => {
  const sql = `
    SELECT id_cliente, nombre, rfc, estatus
    FROM public."Cliente"
    WHERE id_cliente = $1
  `;
  const result = await pool.query(sql, [id_cliente]);
  return result.rows[0];
};

exports.getValidacionesByCliente = async (id_cliente) => {
  const sql = `
    SELECT
      vl.fecha_validacion,
      vl.resultado,
      vl.coincidencia,
      lr.tipo_lista,
      lr.nombre AS nombre_lista,
      lr.fuente
    FROM public."Validacion_Lista" vl
    JOIN public."Lista_Riesgo" lr ON lr.id_lista = vl.id_lista
    WHERE vl.id_cliente = $1
    ORDER BY vl.fecha_validacion DESC
  `;
  const result = await pool.query(sql, [id_cliente]);
  return result.rows;
};

exports.validarContraListas = async (id_cliente, id_usuario) => {
  const clienteRes = await pool.query(
    `SELECT id_cliente, nombre, rfc, estatus FROM public."Cliente" WHERE id_cliente = $1`,
    [id_cliente]
  );

  if (!clienteRes.rows.length) {
    return { coincidencias: 0, total: 0 };
  }

  const { nombre, rfc } = clienteRes.rows[0];
  const listas = await pool.query(`SELECT id_lista, nombre FROM public."Lista_Riesgo"`);
  let coincidencias = 0;
  const listasCoincidentes = [];

  for (const lista of listas.rows) {
    const nombreCliente = nombre.toLowerCase();
    const rfcCliente = (rfc || "").toLowerCase();
    const nombreLista = lista.nombre.toLowerCase();
    const hayCoincidencia =
      nombreCliente.includes(nombreLista) ||
      nombreLista.includes(nombreCliente) ||
      (rfcCliente && nombreLista.includes(rfcCliente));

    const resultado = hayCoincidencia ? "Positivo" : "Negativo";
    const coincidencia = hayCoincidencia ? "Coincidencia" : "Sin_Coincidencia";

    if (hayCoincidencia) {
      coincidencias++;
      listasCoincidentes.push(lista);
    }

    await exports.registrarValidacionListaActual({
      id_cliente,
      id_lista: lista.id_lista,
      id_usuario,
      resultado,
      coincidencia,
      cliente: clienteRes.rows[0],
      lista
    });
  }

  if (coincidencias > 0) {
    await exports.bloquearClientePorCoincidencia(id_cliente);
    await exports.crearAlertaCoincidenciaLista(clienteRes.rows[0], listasCoincidentes);
  }

  return { coincidencias, total: listas.rows.length, bloqueado: coincidencias > 0 };
};

exports.registrarValidacionListaActual = async ({
  id_cliente,
  id_lista,
  id_usuario,
  resultado,
  coincidencia,
  cliente,
  lista
}) => {
  const anteriorRes = await pool.query(`
    SELECT
      vl.resultado,
      vl.coincidencia,
      vl.fecha_validacion,
      lr.tipo_lista,
      lr.nombre AS nombre_lista
    FROM public."Validacion_Lista" vl
    JOIN public."Lista_Riesgo" lr ON lr.id_lista = vl.id_lista
    WHERE vl.id_cliente = $1
      AND vl.id_lista = $2
    ORDER BY vl.fecha_validacion DESC
    LIMIT 1
  `, [id_cliente, id_lista]);

  const anterior = anteriorRes.rows[0];

  if (anterior) {
    await pool.query(`
      INSERT INTO public."Historial" (id_usuario, actividad, modulo, estado)
      VALUES ($1, $2, 'Clientes', 'Completado')
    `, [
      id_usuario,
      `Validacion anterior archivada para cliente #${id_cliente} (${cliente.nombre}) contra lista ${anterior.tipo_lista} - ${anterior.nombre_lista}: ${anterior.resultado} / ${anterior.coincidencia}`
    ]);
  }

  await pool.query(`
    DELETE FROM public."Validacion_Lista"
    WHERE id_cliente = $1
      AND id_lista = $2
  `, [id_cliente, id_lista]);

  await pool.query(`
    INSERT INTO public."Validacion_Lista"
      (id_cliente, id_lista, fecha_validacion, resultado, coincidencia, id_usuario)
    VALUES ($1, $2, NOW(), $3, $4, $5)
  `, [id_cliente, id_lista, resultado, coincidencia, id_usuario]);
};

exports.bloquearClientePorCoincidencia = async (id_cliente) => {
  const sql = `
    UPDATE public."Cliente"
    SET
      estatus = 'Bloqueado',
      motivo_bloqueo = 'Coincidencia en Listas de Riesgo',
      fecha_bloqueo = COALESCE(fecha_bloqueo, CURRENT_DATE)
    WHERE id_cliente = $1
    RETURNING id_cliente, nombre, rfc, estatus, motivo_bloqueo, fecha_bloqueo
  `;
  const result = await pool.query(sql, [id_cliente]);
  return result.rows[0];
};

exports.crearAlertaCoincidenciaLista = async (cliente, listasCoincidentes) => {
  const nombresListas = listasCoincidentes
    .map((lista) => lista.nombre)
    .filter(Boolean)
    .join(", ");
  const motivo = `Coincidencia en Listas de Riesgo: ${cliente.nombre}${cliente.rfc ? ` (${cliente.rfc})` : ""}${nombresListas ? ` - ${nombresListas}` : ""}`;

  const existente = await pool.query(`
    SELECT id_alerta
    FROM public."Alerta"
    WHERE tipo_alerta = 'Lista_Riesgo'
      AND motivo = $1
      AND estatus <> 'Cerrada'
    LIMIT 1
  `, [motivo]);

  if (existente.rows[0]) {
    return existente.rows[0];
  }

  const result = await pool.query(`
    INSERT INTO public."Alerta"
      (tipo_alerta, fecha_generacion, motivo, estatus, prioridad)
    VALUES ('Lista_Riesgo', NOW(), $1, 'Nueva', 'Alta')
    RETURNING id_alerta, tipo_alerta, motivo, estatus, prioridad, fecha_generacion
  `, [motivo]);

  return result.rows[0];
};

exports.validarTodosContraListas = async (id_usuario) => {
  const clientes = await exports.getClientes();
  const resultados = [];
  let clientesConCoincidencia = 0;

  for (const cliente of clientes) {
    const resultado = await exports.validarContraListas(cliente.id_cliente, id_usuario);
    resultados.push({
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre,
      coincidencias: resultado.coincidencias,
      bloqueado: resultado.bloqueado
    });

    if (resultado.coincidencias > 0) {
      clientesConCoincidencia++;
    }
  }

  return {
    total_clientes: clientes.length,
    clientes_con_coincidencia: clientesConCoincidencia,
    resultados
  };
};

exports.getAlertasByCliente = async (id_cliente) => {
  const sql = `
    SELECT
      a.id_alerta,
      a.tipo_alerta,
      a.motivo,
      a.estatus,
      a.prioridad,
      a.fecha_generacion
    FROM public."Alerta" a
    JOIN public."Alerta_Automatica" aa ON aa.id_alerta = a.id_alerta
    JOIN public."Operacion" o ON o.id_operacion = aa.id_operacion
    JOIN public."Contrato" ct ON ct.id_contrato = o.id_contrato
    WHERE ct.id_cliente = $1
    ORDER BY a.fecha_generacion DESC
  `;
  const result = await pool.query(sql, [id_cliente]);
  return result.rows;
};

exports.getDocumentosPendientes = async () => {
  const sql = `
    SELECT
      d.id_documento,
      d.id_usuario,
      u.nombre || ' ' || u.apellido AS nombre_usuario,
      u.correo,
      d.nombre_archivo,
      d.ruta_archivo,
      d.estatus_validacion,
      d.fecha_carga,
      d.datos_cliente
    FROM public."Documento" d
    JOIN public."Usuario" u ON u.id_usuario = d.id_usuario
    WHERE d.id_cliente IS NULL
      AND d.estatus_validacion IN ('Pendiente', 'Rechazado')
    ORDER BY d.fecha_carga DESC
  `;
  const result = await pool.query(sql);
  return result.rows;
};

exports.validarYCrearCliente = async (id_documento, id_usuario_oficial, datosEditados) => {
  const { nombre, tipo_persona, rfc, correo, telefono, domicilio } = datosEditados;

  const clienteResult = await pool.query(`
    INSERT INTO public."Cliente"
      (nombre, tipo_persona, rfc, domicilio, correo, telefono, estatus, fecha_registro)
    VALUES ($1, $2, $3, $4, $5, $6, 'Activo', NOW())
    RETURNING id_cliente
  `, [nombre, tipo_persona, rfc, domicilio, correo, telefono]);

  const idCliente = clienteResult.rows[0].id_cliente;

  await pool.query(`
    UPDATE public."Documento"
    SET
      id_cliente = $1,
      estatus_validacion = 'Validado',
      fecha_validacion = NOW(),
      id_usuario = $2
    WHERE id_documento = $3
  `, [idCliente, id_usuario_oficial, id_documento]);

  return idCliente;
};

exports.rechazarDocumento = async (id_documento, id_usuario_oficial) => {
  await pool.query(`
    UPDATE public."Documento"
    SET
      estatus_validacion = 'Rechazado',
      fecha_validacion = NOW(),
      id_usuario = $1
    WHERE id_documento = $2
  `, [id_usuario_oficial, id_documento]);
};

exports.addDocumentoCliente = async ({ id_usuario, nombre_archivo, ruta_archivo, datos_cliente }) => {
  const sql = `
    INSERT INTO public."Documento"
      (id_usuario, tipo_documento, nombre_archivo, ruta_archivo, estatus_validacion, fecha_carga, datos_cliente)
    VALUES ($1, 'Identificacion', $2, $3, 'Pendiente', NOW(), $4)
    RETURNING *
  `;
  const result = await pool.query(sql, [
    id_usuario,
    nombre_archivo,
    ruta_archivo,
    JSON.stringify(datos_cliente)
  ]);
  return result.rows[0];
};

exports.tienePendiente = async (id_usuario) => {
  const result = await pool.query(`
    SELECT id_documento
    FROM public."Documento"
    WHERE id_usuario = $1
      AND estatus_validacion = 'Pendiente'
    LIMIT 1
  `, [id_usuario]);

  return result.rows.length > 0;
};
