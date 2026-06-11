const { Operacion } = require("../models/operaciones.model");


exports.renderOperations = (req, res) => {
  res.render("operaciones", {
    pageTitle: "Operaciones - Beta 1"
  });
};

exports.getOperaciones = async (req, res) => {
  try {
    const operaciones = await Operacion.findAll();
    res.json(operaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener operaciones" });
  }
};

exports.getPerfilTransaccional = async (req, res)=>{
  try{
    const operaciones= await Operacion.getPerfilTransaccional();
    res.json(perfil);
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al obtener perfil transaccional"});
  }
};

exports.getOperacionesByCliente=async(req,res)=>{
  try{
    const{id}=req.params;
    const operaciones=await Operacion.getOperacionesByCliente(id);
    res.json(operaciones);
  }catch(err){
    console.error(err);
    res.status(500).json({error: "Error al obtener operaciones del cliente"});
  }
};