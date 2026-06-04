const pool = require("../config/database");

exports.getReportes = async () => {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM public."Reporte"
      ORDER BY fecha_generacion DESC
    `);
    return resultado.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.crearReporte = async ({
  tipo,
  titulo,
  prioridad,
  descripcion
}) => {
  const sql = `
    INSERT INTO public."Reporte"
    (
      tipo,
      fecha_generacion,
      estatus_envio,
      titulo,
      prioridad,
      descripcion
    )
    VALUES
    ($1, NOW(), 'Pendiente', $2, $3, $4)
    RETURNING *
  `;

  const values = [
    tipo,
    titulo,
    prioridad,
    descripcion
  ];

  try {
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    const conflictoIdReporte =
      error.code === "23505" &&
      (error.constraint === "pk_reporte" ||
        error.constraint === "Reporte_pkey" ||
        error.detail?.includes("(id_reporte)"));

    if (!conflictoIdReporte) {
      throw error;
    }

    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('public."Reporte"', 'id_reporte'),
        COALESCE((SELECT MAX(id_reporte) FROM public."Reporte"), 1),
        true
      )
    `);

    const result = await pool.query(sql, values);
    return result.rows[0];
  }
};

exports.eliminarReporte = async (id) => {
  try {
    await pool.query(`
      DELETE FROM public."Reporte"
      WHERE id_reporte = $1
    `, [id]);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
