const adminModel = require("../models/admin.model");
const historyModel = require("../models/history.model");

// Devuelve los roles que el usuario en sesión puede crear
function rolesQuePuedeCear(rolesUsuario) {
  const { ROLES_PERMITIDOS_POR_ROL } = adminModel;
  for (const rol of rolesUsuario) {
    if (ROLES_PERMITIDOS_POR_ROL[rol]) return ROLES_PERMITIDOS_POR_ROL[rol];
  }
  return [];
}

// GET /admin/usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await adminModel.getUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// POST /admin/usuarios
exports.crearUsuario = async (req, res) => {
  const { nombre, apellido, correo, contrasena, rol } = req.body;

  if (!nombre?.trim() || !correo?.trim() || !contrasena?.trim() || !rol?.trim()) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const rolesPermitidos = rolesQuePuedeCear(req.session.usuario.roles);
  if (!rolesPermitidos.includes(rol)) {
    return res.status(403).json({ error: "No tienes permiso para crear usuarios con ese rol" });
  }

  try {
    const idNuevo = await adminModel.crearUsuario({ nombre, apellido, correo, contrasena, rol });

    await historyModel.registrarActividad(
      req.session.usuario.id,
      `Creó usuario #${idNuevo} (${correo}) con rol ${rol}`,
      "Usuarios",
      "Activo"
    );

    res.status(201).json({ ok: true, id: idNuevo });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Ya existe un usuario con ese correo" });
    }
    console.error("Error creando usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// PUT /admin/usuarios/:id
exports.editarUsuario = async (req, res) => {
  const { nombre, apellido, rol } = req.body;
  const id = req.params.id;

  const rolesPermitidos = rolesQuePuedeCear(req.session.usuario.roles);
  if (!rolesPermitidos.includes(rol)) {
    return res.status(403).json({ error: "No tienes permiso para asignar ese rol" });
  }

  try {
    const anterior = await adminModel.getUsuarioById(id);
    if (!anterior) return res.status(404).json({ error: "Usuario no encontrado" });
    const rolActual = anterior.roles?.[0];
    if (!rolesQuePuedeCear(req.session.usuario.roles).includes(rolActual)) {
        return res.status(403).json({ error: "No tienes permiso para editar ese usuario" });
    }

    await adminModel.editarUsuario(id, { nombre, apellido, rol });

    await historyModel.registrarActividad(
      req.session.usuario.id,
      `Editó usuario #${id} (${anterior.correo}), nuevo rol: ${rol}`,
      "Usuarios",
      "Activo"
    );

    res.json({ ok: true });
  } catch (error) {
    console.error("Error editando usuario:", error);
    res.status(500).json({ error: "Error al editar usuario" });
  }
};

// DELETE /admin/usuarios/:id
exports.eliminarUsuario = async (req, res) => {
  const id = req.params.id;

  // Prevenir que el admin se elimine a sí mismo
  if (parseInt(id) === req.session.usuario.id) {
    return res.status(400).json({ error: "No puedes eliminarte a ti mismo" });
  }

  try {
    const usuario = await adminModel.getUsuarioById(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // Oficial solo puede eliminar clientes y empleados
    const rolesPermitidos = rolesQuePuedeCear(req.session.usuario.roles);
    const rolVictima = usuario.roles?.[0];
    if (!rolesPermitidos.includes(rolVictima)) {
      return res.status(403).json({ error: "No tienes permiso para eliminar ese usuario" });
    }

    await adminModel.eliminarUsuario(id);

    await historyModel.registrarActividad(
      req.session.usuario.id,
      `Eliminó usuario #${id} (${usuario.correo})`,
      "Usuarios",
      "Activo"
    );

    res.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

// RENDER

exports.renderAdmin = (req, res) => {
  const roles = req.session.usuario?.roles || [];
  const { ROLES_PERMITIDOS_POR_ROL } = adminModel;

  let rolesPermitidos = [];
  for (const rol of roles) {
    if (ROLES_PERMITIDOS_POR_ROL[rol]) {
      rolesPermitidos = ROLES_PERMITIDOS_POR_ROL[rol];
      break;
    }
  }

  res.render("admin", {
    pageTitle: "Gestión de Usuarios",
    rolesPermitidos,
    usuarioSesion: req.session.usuario 
  });
};

// GET /api/umbrales
exports.getUmbrales = async (req, res) => {
  try {
    const clientesModel = require("../models/clientes.model");
    const umbrales = await clientesModel.getUmbralesAdmin();
    res.json(umbrales);
  } catch (error) {
    console.error("Error obteniendo umbrales:", error);
    res.status(500).json({ error: "Error al obtener umbrales" });
  }
};

// PUT /api/umbrales/:id
exports.updateUmbral = async (req, res) => {
  const { nombre, tipo_alerta, valor_limite, nivel, descripcion } = req.body;
  const id = req.params.id;

  const NIVELES_VALIDOS = ["Alta", "Media", "Critica"];
  if (!nombre?.trim() || !tipo_alerta?.trim() || !nivel?.trim() || valor_limite === undefined) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  if (!NIVELES_VALIDOS.includes(nivel)) {
    return res.status(400).json({ error: "Nivel no válido" });
  }
  if (isNaN(Number(valor_limite)) || Number(valor_limite) < 0) {
    return res.status(400).json({ error: "valor_limite debe ser un número positivo" });
  }

  try {
    const clientesModel = require("../models/clientes.model");
    const actualizado = await clientesModel.updateUmbral(id, {
      nombre: nombre.trim(),
      tipo_alerta: tipo_alerta.trim(),
      valor_limite: Number(valor_limite),
      nivel,
      descripcion: descripcion?.trim() ?? ""
    });

    if (!actualizado) return res.status(404).json({ error: "Umbral no encontrado" });

    await historyModel.registrarActividad(
      req.session.usuario.id,
      `Editó umbral #${id} (${nombre}), nuevo límite: $${valor_limite}`,
      "Umbrales",
      "Activo"
    );

    res.json(actualizado);
  } catch (error) {
    console.error("Error actualizando umbral:", error);
    res.status(500).json({ error: "Error al actualizar umbral" });
  }
};

exports.createUmbral = async (req, res) => {
  const { nombre, tipo_alerta, valor_limite, nivel, descripcion } = req.body;

  const NIVELES_VALIDOS = ["Alta", "Media", "Critica"];
  if (!nombre?.trim() || !tipo_alerta?.trim() || !nivel?.trim() || valor_limite === undefined) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  if (!NIVELES_VALIDOS.includes(nivel)) {
    return res.status(400).json({ error: "Nivel no válido" });
  }
  if (isNaN(Number(valor_limite)) || Number(valor_limite) < 0) {
    return res.status(400).json({ error: "valor_limite debe ser un número positivo" });
  }

  try {
    const clientesModel = require("../models/clientes.model");
const result = await clientesModel.createUmbralGlobal({
      nombre: nombre.trim(),
      tipo_alerta: tipo_alerta.trim(),
      valor_limite: Number(valor_limite),
      nivel,
      descripcion: descripcion?.trim() ?? "",
      id_cliente: req.body.id_cliente ? Number(req.body.id_cliente) : null
    });

    await historyModel.registrarActividad(
      req.session.usuario.id,
      `Creó umbral global "${nombre}" con límite $${valor_limite}`,
      "Umbrales",
      "Activo"
    );

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creando umbral:", error);
    res.status(500).json({ error: "Error al crear umbral" });
  }
};

exports.deleteUmbral = async (req, res) => {
  try {
    const clientesModel = require("../models/clientes.model");
    await clientesModel.deleteUmbralGlobal(req.params.id);

    await historyModel.registrarActividad(
      req.session.usuario.id,
      `Eliminó umbral global #${req.params.id}`,
      "Umbrales",
      "Activo"
    );

    res.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando umbral:", error);
    res.status(500).json({ error: "Error al eliminar umbral" });
  }
};