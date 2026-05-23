exports.renderDashboard = (req, res) => {
  if (!req.session.usuario) {
  return res.redirect("/");
  }
  res.render("dashboard", {
    pageTitle: "Inicio - AMP",
    userName: "Usuario"
  });
};
