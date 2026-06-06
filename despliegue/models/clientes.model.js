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
    return result.rows[0]; //se regres al cliente recien creado
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

//nuevo 
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

//obtener todos los documentos de un cliente en especifico
exports.getDocumentosByCliente = async (id_cliente) =>{
  const sql = `
      SELECT
      id_documento,
      id_cliente,
      tipo_documento,
      nombre_archivo,
      ruta_archivo,
      fecha_carga
    FROM public."Documento"
    WHERE id_cliente = $1          
    ORDER BY fecha_carga DESC      
  `;
  const result = await pool.query(sql, [id_cliente]);
  return result.rows;
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
      c.id_cliente,
      c.nombre AS cliente,
      c.rfc
    FROM public."Operacion" o
    JOIN public."Contrato" co
      ON o.id_contrato = co.id_contrato
    JOIN public."Cliente" c
      ON co.id_cliente = c.id_cliente
    WHERE c.id_cliente = $1
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
