const alertasModel= require("../models/alertas.model");
//catch error sirve para agarrar errores y para evitar que se rompa 

exports.renderAlertas = (req, res) => {
  res.render("alertas", {
    pageTitle: "Alertas - Beta 1"
  });
};

exports.getAlertas=async (req, res)=>{
  try {
    const alertas=await alertasModel.getAlertas();
    res.json(alertas);
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al obtener alertas"});
  }
};

exports.getAlertasByOperacion=async (req, res)=>{
  try{
    const {id}= req.params;
    const alertas= await alertasModel.getAlertasByOperacion(id);
    res.json(alertas);
  } catch(err){
    console.error(err);
    res.status(500).json({error: "Error al obtener alertas de la operacion"});
  }
};

exports.updateEstatusAlerta= async (req, res)=>{
  try{
    const {id}=req.params;
    const {estatus}=req.body;
    const alerta=await alertasModel.updateEstatusAlerta(id, estatus);
    if(!alerta){ //ya damos por hecho la existencia de la alerta
      return res.status(404).json({error: "Alerta no encontrada"});
    }
    res.json(alerta);
  }catch(err){
    console.error(err);
    res.status(500).json({error:"Error al actualizar alerta"});
  }
};
