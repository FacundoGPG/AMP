const { Operacion } = require("../models/operations.model");


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
    const perfil = await Operacion.getPerfilTransaccional();
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

exports.createOperacion = async (req, res) => {
  const { id_contrato, tipo_operacion, monto, canal, fecha } = req.body;

  if (!id_contrato || !tipo_operacion || !monto || !canal || !fecha) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const operacion = await Operacion.createOperacion({
      id_contrato,
      tipo_operacion,
      monto,
      canal,
      fecha
    });

    res.status(201).json({ operacion, alertas });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear operacion" });
  }
};
