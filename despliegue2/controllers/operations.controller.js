const { Operacion } = require("../models/operaciones.model");


exports.renderOperations = (req, res) => {
  res.render("operaciones", {
    pageTitle: "Operaciones - Beta 1"
  });
};

exports.getOperaciones = async (req, res) => {
  try {
    const operaciones = await Operacion.findAll();
    res.json(operaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener operaciones" });
  }
};
