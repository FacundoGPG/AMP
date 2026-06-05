const alertasModel = require("../models/alertas.model");

exports.renderAlertas = (req, res) => {
  res.render("alertas", {
    pageTitle: "Alertas - Beta 1"
  });
};

exports.getAlertas = async (req, res) => {
  try {
    const alertas = await alertasModel.getAlertas();
    res.json(alertas);
  } catch (error) {
    console.error("Erorr al cargar Alertas", error);
    res.status(500).json({ error: "Error al obtener alertas" })
  }
};
