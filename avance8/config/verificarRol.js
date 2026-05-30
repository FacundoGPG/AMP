function verificarRol(rolesPermitidos){
    return (req,res, next) =>{
        if (!req.session.usuario){
            return res.redirect("/");
        }
        if (!rolesPermitidos.includes(req.session.usuario.rol)){
            return res.status(402).send("No tienens los permisos suficientes");
        }
        next(); //verifica que este corredcto todo, da los permisos que pase al siguiente nivel
    }
}
module.exports=verificarRol;