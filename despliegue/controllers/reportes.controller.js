const reportesModel = require('../models/reportes.model')


exports.renderReportes = async (req, res) => {
  try {
    const reportes = await reportesModel.getReportes();
    res.render("reportes", {
      pageTitle: "Reportes - Beta 1",
      reportes: reportes,
      usuarioSesion: req.session.usuario,
      csrfToken: res.locals.csrfToken
    });
  } catch (err) {
      console.error(err);
      res.status(500).send("Error al obtener reportes");
  };
}

exports.crearReporte = async (req, res) => {
  try { 
  await reportesModel.crearReporte(req.body);
  res.redirect("/reportes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener reportes");
  }
};

exports.eliminarReporte = async (req, res) => {
  try { await reportesModel.eliminarReporte(req.params.id);
  res.redirect("/reportes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener reportes");
  }
};
