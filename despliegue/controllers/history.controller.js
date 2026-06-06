const historyModel = require("../models/history.model");

exports.renderHistory = (req, res) => {
  res.render("history", {
    pageTitle: "Historial - Beta 1"
  });
};

exports.getHistorial = async (req, res) => {
  try {
    const historial = await historyModel.getHistorial();
    res.json(historial);
  } catch (error) {
    console.error("Error cargando historial:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
};