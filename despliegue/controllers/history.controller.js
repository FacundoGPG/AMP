/* const { History } = require("../models/history.model");

exports.renderHistory = async (req, res) => {
  try {
    const historyData = await History.findAll();

    res.render("history", {
      pageTitle: "Historial - Beta 1",
      historyData,
    });
  } catch (error) {
    console.error("Error cargando historial:", error);
    res.status(500).send("Error al cargar el historial de actividades.");
  }
};
*/

exports.renderHistory = (req, res) => {
  res.render("history", {
    pageTitle: "Historial - Beta 1"
  });
};
