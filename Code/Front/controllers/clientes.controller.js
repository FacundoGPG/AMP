exports.renderClientes = (req, res) => {
  res.render("clientes", {
    pageTitle: "Clientes - Alpha 1",
    activeTab: req.query.tab || "clientes"
  });
};
