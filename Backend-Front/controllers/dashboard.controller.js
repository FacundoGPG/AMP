exports.renderDashboard = (req, res) => {
  res.render("dashboard", {
    pageTitle: "Inicio - AMP",
    userName: "Usuario"
  });
};
