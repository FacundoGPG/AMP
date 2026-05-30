const dashboardModel = require("../models/dashboard.model");

exports.renderDashboard = async (req, res) => {
  if (!req.session.usuario) {
    return res.redirect("/");
  }

try {
    const resumen = await dashboardModel.getResumen();

    res.render("dashboard", {
      pageTitle: "Inicio - AMP",
      resumen
    });
  } catch (error) {
    console.error("Error cargando dashboard:", error);
    res.status(500).send("Error al cargar el dashboard");
  }
};

