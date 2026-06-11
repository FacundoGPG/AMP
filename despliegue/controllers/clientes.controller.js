const clientesModel = require("../models/clientes.model");
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

exports.getOperacionesDeCliente = async (req, res) => {
  try {
    const operaciones = await clientesModel.getOperacionesByCliente(req.params.id);
    res.json(operaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener operaciones" });
  }
};
