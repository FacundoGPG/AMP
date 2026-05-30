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