const dashboardModel = require("../models/dashboard.model");
exports.renderDashboard = async (req, res) => {
  try {
    // const resumen = await dashboardModel.getResumen();

    return res.render("dashboard", {
      pageTitle: "Inicio - AMP",
      // resumen;
    });
  } catch (error) {
    console.error("Error cargando dashboard:", error);
    return res.status(500).send("Error al cargar el dashboard");
  }
};
