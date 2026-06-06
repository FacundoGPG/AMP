const dashboardModel = require("../models/dashboard.model");

function tiempoRelativo(fecha) {
  const ahora = new Date();
  const diff = Math.floor((ahora - new Date(fecha)) / 1000);

  if (diff < 60)       return `Hace ${diff} seg`;
  if (diff < 3600)     return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400)    return `Hace ${Math.floor(diff / 3600)} h`;
  if (diff < 2592000)  return `Hace ${Math.floor(diff / 86400)} días`;
  if (diff < 31536000) return `Hace ${Math.floor(diff / 2592000)} meses`;
  return                      `Hace ${Math.floor(diff / 31536000)} años`;
}

exports.tiempoRelativo = tiempoRelativo;

exports.renderDashboard = async (req, res) => {
  try {
    const [resumen, bloqueados, alertas, operaciones] = await Promise.all([
      dashboardModel.getResumen(),
      dashboardModel.getPersonasBloqueadas(),
      dashboardModel.getAlertasRecientes(),
      dashboardModel.getOperacionesRecientes(),
    ]);

    res.render("dashboard", {
      pageTitle: "Inicio - AMP",
      resumen,
      bloqueados,
      alertas,
      operaciones,
      tiempoRelativo,
    });
  } catch (error) {
    console.error("Error cargando dashboard:", error);
    res.status(500).send("Error al cargar el dashboard");
  }
};