exports.renderClientes = (req, res) => {
  res.render("clientes", {
    pageTitle: "Clientes - Beta 1",
    activeTab: req.query.tab || "clientes"
  });
};
