function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.session.usuario) {
      return res.redirect("/");
    }
    const rolesUsuario = req.session.usuario.roles || [];
    const tieneAcceso = rolesUsuario.some(rol => rolesPermitidos.includes(rol));
    if (!tieneAcceso) {
      return res.status(403).send("No tienes los permisos suficientes");
    }
    next();
  };
}
module.exports = verificarRol;