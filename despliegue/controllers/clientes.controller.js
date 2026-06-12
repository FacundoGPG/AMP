const clientesModel = require("../models/clientes.model");
const historyModel = require("../models/history.model");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/documentos/");
  },
  filename: (req, file, cb) => {
    const nombreArchivo = Date.now() + path.extname(file.originalname);
    cb(null, nombreArchivo);
  }
});

const upload = multer({ storage });
exports.uploadDocumentos = upload.fields([
  { name: "doc_identificacion", maxCount: 1 },
  { name: "doc_rfc", maxCount: 1 },
  { name: "doc_domicilio", maxCount: 1 }
]);

exports.renderClientes = async (req, res) => {
  try {
    const clientes = await clientesModel.getClientes();
    const clientesBloqueados = await clientesModel.getClientesBloqueados();

    res.render("clientes", {
      pageTitle: "Clientes - Beta 1",
      activeTab: req.query.tab || "clientes",
      totalClientes: clientes.length,
      totalBloqueados: clientesBloqueados.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar clientes");
  }
};

exports.getClientes = async (req, res) => {
  try {
    const clientes = await clientesModel.getClientes();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

exports.getClientesBloqueados = async (req, res) => {
  try {
    const clientes = await clientesModel.getClientesBloqueados();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener clientes bloqueados" });
  }
};

exports.addCliente = async (req, res) => {
  const {
    nombre,
    tipo_persona,
    rfc,
    domicilio,
    correo,
    telefono,
    estatus,
    motivo_bloqueo,
    fecha_bloqueo
  } = req.body;

  const camposObligatorios = [
    nombre,
    tipo_persona,
    rfc,
    domicilio,
    correo,
    telefono,
    estatus
  ];

  const tiposPermitidos = ["Física", "Moral"];
  const estatusPermitidos = ["Activo", "Bloqueado"];

  const limites = {
    nombre: 100,
    rfc: 13,
    domicilio: 150,
    correo: 100,
    telefono: 20,
    motivo_bloqueo: 200
  };

  const excedeLimite = Object.entries(limites).some(([campo, limite]) => {
    const valor = req.body[campo];
    return typeof valor === "string" && valor.trim().length > limite;
  });

  if (
    camposObligatorios.some((campo) => !campo?.trim()) ||
    !tiposPermitidos.includes(tipo_persona) ||
    !estatusPermitidos.includes(estatus) ||
    excedeLimite
  ) {
    return res.status(400).send("Los datos del cliente son incompletos o inválidos");
  }

  try {
    await clientesModel.addCliente({
      nombre: nombre.trim(),
      tipo_persona,
      rfc: rfc.trim().toUpperCase(),
      domicilio: domicilio.trim(),
      correo: correo.trim().toLowerCase(),
      telefono: telefono.trim(),
      estatus,
      motivo_bloqueo: motivo_bloqueo?.trim(),
      fecha_bloqueo
    });

    return res.redirect("/clientes");
  } catch (error) {
    console.error("Error al agregar cliente:", error);

    if (error.code === "23505") {
      return res.status(409).send("Ya existe un cliente con esos datos únicos");
    }

    if (error.code === "22001") {
      return res.status(400).send("Uno de los campos supera la longitud permitida");
    }

    return res.status(500).send("Error al agregar cliente");
  }
};

exports.updateCliente = async (req, res) => {
  const id_cliente = req.params.id;

  const {
    nombre,
    tipo_persona,
    rfc,
    domicilio,
    correo,
    telefono,
    estatus,
    motivo_bloqueo,
    fecha_bloqueo
  } = req.body;

  const camposObligatorios = [
    nombre,
    tipo_persona,
    rfc,
    domicilio,
    correo,
    telefono,
    estatus
  ];
  const estatusPermitidos = ["Activo", "Bloqueado"];
  const motivoBloqueoLimpio = motivo_bloqueo?.trim() || null;

  if (
    camposObligatorios.some((c) => !c?.trim()) ||
    !estatusPermitidos.includes(estatus) ||
    (estatus === "Bloqueado" && !motivoBloqueoLimpio) ||
    motivoBloqueoLimpio?.length > 200
  ) {
    return res.status(400).send("Los datos del cliente son incompletos o invalidos");
  }

  try {
    const clienteAnterior = await clientesModel.getClienteById(id_cliente);
    const clienteActualizado = await clientesModel.updateCliente(id_cliente, {
      nombre: nombre.trim(),
      tipo_persona,
      rfc: rfc.trim().toUpperCase(),
      domicilio: domicilio.trim(),
      correo: correo.trim().toLowerCase(),
      telefono: telefono.trim(),
      estatus,
      motivo_bloqueo: estatus === "Bloqueado" ? motivoBloqueoLimpio : null,
      fecha_bloqueo: estatus === "Bloqueado" ? fecha_bloqueo || new Date().toISOString().slice(0, 10) : null
    });

    if (!clienteActualizado) {
      return res.status(404).send("Cliente no encontrado");
    }

    if (clienteAnterior && clienteAnterior.estatus !== estatus) {
      await historyModel.registrarActividad(
        req.session.usuario.id,
        `Cambio estatus del cliente #${id_cliente} (${clienteAnterior.estatus} -> ${estatus})`,
        "Clientes",
        "Completado"
      );
    }

    return res.redirect("/clientes");
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    return res.status(500).send("Error al actualizar cliente");
  }
};

exports.subirDocumentos = async (req, res) => {
  const id_cliente = req.params.id;
  const archivos = req.files;

  if (!archivos || Object.keys(archivos).length === 0) {
    return res.status(400).send("No se recibieron archivos");
  }

  try {
    const tiposDocumento = {
      doc_identificacion: "Identificacion",
      doc_rfc: "RFC",
      doc_domicilio: "Comprobante_Domicilio"
    };

    for (const campo in archivos) {
      const archivo = archivos[campo][0];

      await clientesModel.addDocumento({
        id_cliente,
        tipo_documento: tiposDocumento[campo],
        nombre_archivo: archivo.originalname,
        ruta_archivo: archivo.path
      });
    }

    const documentos = await clientesModel.getDocumentosByCliente(id_cliente);
    return res.json({ ok: true, documentos });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al guardar documentos");
  }
};

exports.getDocumentos = async (req, res) => {
  try {
    const documentos = await clientesModel.getDocumentosByCliente(req.params.id);
    res.json(documentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener documentos" });
  }
};

exports.validarDocumento = async (req, res) => {
  try {
    const { estatus } = req.body;
    const idUsuario = req.session.usuario?.id;
    await clientesModel.validarDocumento(req.params.id, idUsuario, estatus);
    res.json({ success: true });
  } catch (error) {
    console.error("Error validando documento:", error);
    res.status(500).json({ error: "Error al validar documento" });
  }
};

exports.getOperacionesDeCliente = async (req, res) => {
  try {
    const operaciones = await clientesModel.getOperacionesByCliente(req.params.id);
    res.json(operaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener operaciones" });
  }
};

exports.getUmbralesCliente = async (req, res) => {
  try {
    const umbrales = await clientesModel.getUmbralesByCliente(req.params.id);
    res.json(umbrales);
  } catch (error) {
    console.error("Error obteniendo umbrales:", error);
    res.status(500).json({ error: "Error al obtener umbrales" });
  }
};

exports.toggleUmbralCliente = async (req, res) => {
  const idCliente = req.params.id;
  const idUmbral = req.params.idUmbral;
  const { activo } = req.body;
  const idUsuario = req.session.usuario.id;

  try {
    const resultado = await clientesModel.toggleUmbral(idCliente, idUmbral, activo, idUsuario);

    await historyModel.registrarActividad(
      idUsuario,
      `${activo ? "Activo" : "Desactivo"} umbral #${idUmbral} para cliente #${idCliente}`,
      "Clientes",
      "Completado"
    );

    res.json(resultado);
  } catch (error) {
    console.error("Error actualizando umbral:", error);
    res.status(500).json({ error: "Error al actualizar umbral" });
  }
};

exports.getContratosCliente = async (req, res) => {
  try {
    const contratos = await clientesModel.getContratosByCliente(req.params.id);
    res.json(contratos);
  } catch (error) {
    console.error("Error obteniendo contratos:", error);
    res.status(500).json({ error: "Error al obtener contratos" });
  }
};

exports.createContrato = async (req, res) => {
  const idCliente = req.params.id;
  const { id_producto, fecha_inicio, fecha_fin, saldo } = req.body;

  if (!id_producto || !fecha_inicio || !saldo) {
    return res.status(400).json({ error: "Producto, fecha de inicio y saldo son obligatorios" });
  }

  try {
    const contrato = await clientesModel.createContrato({
      id_cliente: idCliente,
      id_producto,
      fecha_inicio,
      fecha_fin,
      saldo
    });

    await historyModel.registrarActividad(
      req.session.usuario.id,
      `Creo contrato #${contrato.id_contrato} para cliente #${idCliente}`,
      "Contratos",
      "Completado"
    );

    res.status(201).json(contrato);
  } catch (error) {
    console.error("Error creando contrato:", error);
    res.status(500).json({ error: "Error al crear contrato" });
  }
};

exports.getProductos = async (req, res) => {
  try {
    const productos = await clientesModel.getProductos();
    res.json(productos);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

exports.getValidacionesCliente = async (req, res) => {
  try {
    const validaciones = await clientesModel.getValidacionesByCliente(req.params.id);
    res.json(validaciones);
  } catch (error) {
    console.error("Error obteniendo validaciones:", error);
    res.status(500).json({ error: "Error al obtener validaciones" });
  }
};

exports.validarClienteListas = async (req, res) => {
  const idCliente = req.params.id;
  const idUsuario = req.session.usuario.id;

  try {
    const cliente = await clientesModel.getClienteById(idCliente);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const resultado = await clientesModel.validarContraListas(idCliente, idUsuario);

    if (resultado.coincidencias > 0) {
      await historyModel.registrarActividad(
        idUsuario,
        `Validacion de cliente #${idCliente} (${cliente.nombre}): ${resultado.coincidencias} coincidencia(s)`,
        "Clientes",
        "Alerta"
      );
    }

    res.json(resultado);
  } catch (error) {
    console.error("Error validando cliente:", error);
    res.status(500).json({ error: "Error al validar cliente" });
  }
};

exports.getAlertasDeCliente = async (req, res) => {
  try {
    const alertas = await clientesModel.getAlertasByCliente(req.params.id);
    res.json(alertas);
  } catch (error) {
    console.error("Error obteniendo alertas:", error);
    res.status(500).json({ error: "Error al obtener alertas" });
  }
};



// GET /api/documentos/pendientes — lista para el Oficial
exports.getDocumentosPendientes = async (req, res) => {
  try {
    const docs = await clientesModel.getDocumentosPendientes();
    res.json(docs);
  } catch (error) {
    console.error("Error obteniendo documentos pendientes:", error);
    res.status(500).json({ error: "Error al obtener documentos" });
  }
};

// POST /api/documentos/:id/validar — Oficial valida y crea cliente
exports.validarDocumento = async (req, res) => {
  const id_usuario_oficial = req.session.usuario?.id;
  try {
    const idCliente = await clientesModel.validarYCrearCliente(
      req.params.id, id_usuario_oficial, req.body
    );
    res.json({ ok: true, idCliente });
  } catch (error) {
    console.error("Error validando documento:", error);
    res.status(500).json({ error: "Error al validar documento" });
  }
};

// POST /api/documentos/:id/rechazar
exports.rechazarDocumento = async (req, res) => {
  const id_usuario_oficial = req.session.usuario?.id;
  try {
    await clientesModel.rechazarDocumento(req.params.id, id_usuario_oficial);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error rechazando documento:", error);
    res.status(500).json({ error: "Error al rechazar documento" });
  }
};


exports.getUmbralesAdmin = async (req, res) => {
  try {
    const umbrales = await clientesModel.getUmbralesAdmin();
    res.json(umbrales);
  } catch (error) {
    console.error("Error obteniendo catálogo de umbrales:", error);
    res.status(500).json({ error: "Error al obtener umbrales" });
  }
};

exports.updateUmbralAdmin = async (req, res) => {
  const { nombre, tipo_alerta, valor_limite, nivel, descripcion } = req.body;
  const id_umbral = req.params.id;

  const NIVELES_VALIDOS = ["Alta", "Media", "Baja"];
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
    const actualizado = await clientesModel.updateUmbral(id_umbral, {
      nombre: nombre.trim(),
      tipo_alerta: tipo_alerta.trim(),
      valor_limite: Number(valor_limite),
      nivel,
      descripcion: descripcion?.trim() ?? ""
    });

    if (!actualizado) return res.status(404).json({ error: "Umbral no encontrado" });

    res.json(actualizado);
  } catch (error) {
    console.error("Error actualizando umbral:", error);
    res.status(500).json({ error: "Error al actualizar umbral" });
  }
};


exports.createUmbralPersonalizado = async (req, res) => {
  const id_cliente = req.params.id;
  const { nombre, tipo_alerta, valor_limite, nivel, descripcion } = req.body;

  const NIVELES_VALIDOS = ["Alta", "Media", "Baja"];
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
    const umbral = await clientesModel.createUmbralPersonalizado(id_cliente, {
      nombre: nombre.trim(),
      tipo_alerta: tipo_alerta.trim(),
      valor_limite: Number(valor_limite),
      nivel,
      descripcion
    });


    res.status(201).json(umbral);
  } catch (error) {
    console.error("Error creando umbral personalizado:", error);
    res.status(500).json({ error: "Error al crear umbral personalizado" });
  }
};

exports.deleteUmbralPersonalizado = async (req, res) => {
  const { id, idUmbral } = req.params;

  try {
    const eliminado = await clientesModel.deleteUmbralPersonalizado(idUmbral, id);
    if (!eliminado) {
      return res.status(404).json({ error: "Umbral no encontrado o no es personalizado de este cliente" });
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando umbral personalizado:", error);
    res.status(500).json({ error: "Error al eliminar umbral personalizado" });
  }
};