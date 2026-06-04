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
