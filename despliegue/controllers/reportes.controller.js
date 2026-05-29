const pool = require("../config/database");

exports.get_reportes = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM public."Reporte"
      ORDER BY fecha_generacion DESC
    `);

    res.render("Reportes", {
      pageTitle: "Reportes - Beta 1",
      reportes: resultado.rows,
      usuarioSesion: req.session.usuario,
      csrfToken: res.locals.csrfToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener reportes");
  }
};

exports.post_crear = async (req, res) => {
  try {
    const { tipo } = req.body;

    await pool.query(`
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
    `, [
      Math.floor(Math.random() * 100000),
      tipo
    ]);

    res.redirect("/reportes");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear reporte");
  }
};

exports.delete_reporte = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`
      DELETE FROM public."Reporte"
      WHERE id_reporte = $1
    `, [id]);

    res.redirect("/reportes");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar reporte");
  }
};