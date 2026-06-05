const buzonModel = require("../models/buzon.model");

exports.renderBuzon = (req, res) => {
  res.render("buzon", {
    pageTitle: "Buzon - Beta 1"
  });
};



exports.getBuzon = async (req, res) => {
  try {
    const reportes = await buzonModel.getBuzon();
    res.json(reportes);
  }catch (error) {
    console.error("Error cargando buzón", error);
    res.status(500).json({ error: "Error al obtener reportes" });
  }
};

exports.getBuzonById = async (req, res) => {
  try {
    const reporte = await buzonModel.getBuzonById(req.params.id);
    if(!reporte) {
      return res.status(404).json({ error: "Reporte no encontrado" });
    }
    res.json(reporte);
  } catch (error) {
    console.error("Error cargando reporte: ", error);
    res.status(500).json({ error: "Error al obtener reporte" })
  }

};

exports.getContadores = async (req, res) => {
  try {
    const contadores = await buzonModel.getContadores();
    res.json(contadores);
  } catch (error) {
    console.error ("Error cargando contadores: ", error);
    res.status(500).json({ error: "Error al obtener contadores" });
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await buzonModel.getUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

exports.updateBuzon = async (req, res) => {
  const {
    estatus,
    idEncargado,
    notas
  } = req.body;

  if(!estatus) {
    return res.status(400).json({ error: "El estatus es obligatorio" });
  }

  try {
    await buzonModel.updateBuzon(req.params.id, estatus, idEncargado, notas);
    return res.json({ success: true });
  } catch (error) {
    console.error("Error actualizando reporte: ", error)
    return res.status(500).json({ error: "Error al actualizar reporte" });
  }
};