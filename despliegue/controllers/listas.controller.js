const listasModel = require("../models/listas.model");
 
const TIPOS_LISTA  = ["PEP", "Lista_Negra", "Sancion", "Otro"];
 

exports.renderListas = async (req, res) => {
  try {
    const listas = await listasModel.getListas();
    res.render("listas", {
      pageTitle: "Listas de Riesgo",
      listas,
      tiposLista: TIPOS_LISTA
    });
  } catch (error) {
    console.error("Error cargando listas:", error);
    res.status(500).send("Error al cargar listas de riesgo");
  }
};
 
// GET
exports.getListas = async (req, res) => {
  try {
    const listas = await listasModel.getListas();
    res.json(listas);
  } catch (error) {
    console.error("Error obteniendo listas:", error);
    res.status(500).json({ error: "Error al obtener listas" });
  }
};
 
// POST
exports.addLista = async (req, res) => {
  const { tipo_lista, nombre, fuente } = req.body;
 
  if (!tipo_lista?.trim() || !nombre?.trim() || !fuente?.trim()) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
 
  if (!TIPOS_LISTA.includes(tipo_lista)) {
    return res.status(400).json({ error: "Tipo de lista no válido" });
  }
 
  try {
    const lista = await listasModel.addLista({
      tipo_lista,
      nombre:  nombre.trim(),
      fuente:  fuente.trim()
    });
 
// Registrar antes de borrar para conservar el id_lista
    await listasModel.registrarConfiguracion({
      id_usuario:         req.session.usuario.id,
      id_lista:           id_lista,
      tipo_accion:        "Eliminacion",
      descripcion_cambio: `Se eliminó la lista "${lista.nombre}" de tipo ${lista.tipo_lista}`
    });

    await listasModel.deleteLista(id_lista);
    res.status(201).json(lista);
  } catch (error) {
    console.error("Error agregando lista:", error);
    res.status(500).json({ error: "Error al agregar lista" });
  }
};

// PUT
exports.updateLista = async (req, res) => {
  const id_lista = req.params.id;
  const { tipo_lista, nombre, fuente } = req.body;
 
  if (!tipo_lista?.trim() || !nombre?.trim() || !fuente?.trim()) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
 
  if (!TIPOS_LISTA.includes(tipo_lista)) {
    return res.status(400).json({ error: "Tipo de lista no válido" });
  }
 
  try {
    const anterior = await listasModel.getListaById(id_lista);
    if (!anterior) return res.status(404).json({ error: "Lista no encontrada" });
 
    const actualizada = await listasModel.updateLista(id_lista, {
      tipo_lista,
      nombre: nombre.trim(),
      fuente: fuente.trim()
    });
 
    await listasModel.registrarConfiguracion({
      id_usuario:         req.session.usuario.id,
      id_lista:           id_lista,
      tipo_accion:        "Actualizacion",
      descripcion_cambio: `Se actualizó la lista "${anterior.nombre}" → "${actualizada.nombre}"`
    });
 
    res.json(actualizada);
  } catch (error) {
    console.error("Error actualizando lista:", error);
    res.status(500).json({ error: "Error al actualizar lista" });
  }
};
 

exports.deleteLista = async (req, res) => {
  const id_lista = req.params.id;

  try {
    const lista = await listasModel.getListaById(id_lista);
    if (!lista) return res.status(404).json({ error: "Lista no encontrada" });

    await listasModel.deleteLista(id_lista);

    await listasModel.registrarConfiguracion({
      id_usuario:         req.session.usuario.id,
      id_lista:           null,
      tipo_accion:        "Eliminacion",
      descripcion_cambio: `Se eliminó la lista "${lista.nombre}" de tipo ${lista.tipo_lista}`
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando lista:", error.message, error.detail);
    res.status(500).json({ error: "Error al eliminar lista", detalle: error.message });
  }
};
 
// GET historial
exports.getHistorialLista = async (req, res) => {
  try {
    const historial = await listasModel.getConfiguracionByLista(req.params.id);
    res.json(historial);
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
};