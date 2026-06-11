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
      COALESCE(cu.activo, false) AS activo
    FROM public."Umbral" u
    LEFT JOIN public."Cliente_Umbral" cu
      ON cu.id_umbral = u.id_umbral
      AND cu.id_cliente = $1
    ORDER BY u.nivel ASC, u.tipo_alerta ASC
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
    `SELECT nombre, rfc FROM public."Cliente" WHERE id_cliente = $1`,
    [id_cliente]
  );

  if (!clienteRes.rows.length) {
    return { coincidencias: 0, total: 0 };
  }

  const { nombre, rfc } = clienteRes.rows[0];
  const listas = await pool.query(`SELECT id_lista, nombre FROM public."Lista_Riesgo"`);
  let coincidencias = 0;

  for (const lista of listas.rows) {
    const nombreCliente = nombre.toLowerCase();
    const rfcCliente = (rfc || "").toLowerCase();
    const nombreLista = lista.nombre.toLowerCase();
    const hayCoincidencia =
      nombreCliente.includes(nombreLista) ||
      nombreLista.includes(nombreCliente) ||
      nombreLista.includes(rfcCliente);

    const resultado = hayCoincidencia ? "Positivo" : "Negativo";
    const coincidencia = hayCoincidencia ? "Coincidencia" : "Sin_Coincidencia";

    if (hayCoincidencia) {
      coincidencias++;
    }

    await pool.query(`
      INSERT INTO public."Validacion_Lista"
        (id_cliente, id_lista, fecha_validacion, resultado, coincidencia, id_usuario)
      VALUES ($1, $2, NOW(), $3, $4, $5)
    `, [id_cliente, lista.id_lista, resultado, coincidencia, id_usuario]);
  }

  return { coincidencias, total: listas.rows.length };
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
