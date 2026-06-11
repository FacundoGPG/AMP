const casosModel = require("../models/casos.model");

exports.renderCasos = (req, res) => {
  res.render("casos", { pageTitle: "Casos - SVA" });
};

exports.getCasos = async (req, res) => {
  try {
    const casos = await casosModel.getCasos();
    res.json(casos);
  } catch (error) {
    console.error("Error cargando casos:", error);
    res.status(500).json({ error: "Error al obtener casos" });
  }
};

exports.getCasoById = async (req, res) => {
  try {
    const caso = await casosModel.getCasoById(req.params.id);
    if (!caso) return res.status(404).json({ error: "Caso no encontrado" });
    res.json(caso);
  } catch (error) {
    console.error("Error cargando caso:", error);
    res.status(500).json({ error: "Error al obtener caso" });
  }
};

exports.createCaso = async (req, res) => {
  const { descripcion, idAlerta } = req.body;
  const idUsuario = req.session.usuario?.id;

  if (!descripcion) {
    return res.status(400).json({ error: "La descripción es obligatoria" });
  }

  try {
    const idCaso = await casosModel.createCaso(descripcion, idAlerta || null, idUsuario);
    res.json({ success: true, idCaso });
  } catch (error) {
    console.error("Error creando caso:", error);
    res.status(500).json({ error: "Error al crear caso" });
  }
};

exports.updateEstatus = async (req, res) => {
  const { estatus } = req.body;
  try {
    await casosModel.updateEstatus(req.params.id, estatus);
    res.json({ success: true });
  } catch (error) {
    console.error("Error actualizando estatus:", error);
    res.status(500).json({ error: "Error al actualizar estatus" });
  }
};

exports.addComentario = async (req, res) => {
  const { comentario } = req.body;
  const idUsuario = req.session.usuario?.id;
  try {
    await casosModel.addComentario(req.params.id, idUsuario, comentario);
    res.json({ success: true });
  } catch (error) {
    console.error("Error agregando comentario:", error);
    res.status(500).json({ error: "Error al agregar comentario" });
  }
};

exports.addAlerta = async (req, res) => {
  const { idAlerta } = req.body;
  try {
    await casosModel.addAlerta(req.params.id, idAlerta);
    res.json({ success: true });
  } catch (error) {
    console.error("Error vinculando alerta:", error);
    res.status(500).json({ error: "Error al vincular alerta" });
  }
};

exports.getOficiales = async (req, res) => {
  try {
    const oficiales = await casosModel.getOficiales();
    res.json(oficiales);
  } catch (error) {
    console.error("Error cargando oficiales:", error);
    res.status(500).json({ error: "Error al obtener oficiales" });
  }
};