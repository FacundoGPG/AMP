const clientesModel = require("../models/clientes.model");

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
  const tiposPermitidos = ["Fisica", "Moral"];
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
