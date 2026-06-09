const pool = require("../config/database");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const log= console.log;


exports.exportarCSV = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM public."Reporte"
      ORDER BY fecha_generacion DESC
    `);
  
  const campos = [
    "folio",
    "fecha_generacion",
    "nombre",
    "apellido_paterno",
    "apellido_materno",
    "rfc",
    "monto",
    "moneda",
    "estatus_envio",
    "tipo_reporte",
    "periodo_reporte",
    "organo_supervisor",
    "clave_sujeto_obligado",
    "localidad",
    "codigo_postal",
    "tipo_operacion",
    "instrumento_monetario",
    "numero_cuenta",
  ];
  const parser = new Parser({
    fields: campos,
    delimiter: ";"
  });

  const csv = parser.parse(resultado.rows);

  res.header("Content-Type", "text/csv");
  res.attachment("reporte_sofom.csv");
  res.send(csv);

 } catch (err) {
  console.error(err);
  res.status(500).send("Error al exportar CSV");
 }
};
//pdf
exports.exportarPDF = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM public."Reporte"
      ORDER BY fecha_generacion DESC
    `);

  const doc = new PDFDocument();

  res.setHeader("Content-Disposition", "attachment; filename=reporte_sofom.pdf");
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(18).text("Reporte SOFOM");
  doc.moveDown();

  resultado.rows.forEach(reporte => {
    doc.text("Folio: " + reporte.folio);
    doc.text("Fecha: "+ reporte.fecha_generacion);
    doc.text("Cliente: " + reporte.nombre + " " + reporte.apellido_paterno);
    doc.text("RFC: " + reporte.rfc);
    doc.text("Monto: $" + reporte.monto);
    doc.text("Moneda: " + reporte.moneda);
    doc.text("Estatus: "+ reporte.estatus_envio);
    doc.moveDown();
  });

  doc.end();

 }catch (err) {
  console.error(err);
  res.status(500).send("Error al exportar PDF");
 }
};

exports.exportarXML = async (req, res)=>{
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM public."Reporte"
      ORDER BY fecha_generacion DESC
    `);

    let xml = "";
    xml += `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<reportes>\n`;

    resultado.rows.forEach((reporte)=>{
      xml += ` <reporte>\n`;
      xml+= `  <folio>${reporte.folio}</folio>\n`;
      xml += `    <fecha>${reporte.fecha_generacion}</fecha>\n`;
      xml += `    <nombre>${reporte.nombre}</nombre>\n`;
      xml += `    <apellido_paterno>${reporte.apellido_paterno}</apellido_paterno>\n`;
      xml += `    <apellido_materno>${reporte.apellido_materno}</apellido_materno>\n`;
      xml += `    <rfc>${reporte.rfc}</rfc>\n`;
      xml += `    <monto>${reporte.monto}</monto>\n`;
      xml += `    <moneda>${reporte.moneda}</moneda>\n`;
      xml += `    <estatus_envio>${reporte.estatus_envio}</estatus_envio>\n`;
      xml += `  </reporte>\n`;
    });
    xml+= `</reportes>`;
    res.header("Content-Type", "application/xml");
    res.attachment("reporte_sofom.xml");
    res.send(xml);
  }catch (err){
    console.error(err);
    res.status(500).send("Error al exportar XML");
  }
};
//txt
exports.exportarTXT = async (req, res)=>{
  try{
    const resultado = await pool.query(`
      SELECT *
      FROM public."Reporte"
      ORDER BY fecha_generacion DESC
    `);
    let texto ="";
    resultado.rows.forEach((reporte)=>{
      texto+= "Folio: "+reporte.folio+"\n";
      texto += "Fecha: " + reporte.fecha_generacion + "\n";
      texto += "Cliente: " + reporte.nombre + " " + reporte.apellido_paterno + "\n";
      texto += "RFC: " + reporte.rfc + "\n";
      texto += "Monto: $" + reporte.monto + "\n";
      texto += "Moneda: " + reporte.moneda + "\n";
      texto += "Estatus: " + reporte.estatus_envio + "\n";
      texto += "-----------------------------\n";
    });
    res.header("Content-Type", "text/plain");
    res.attachment("reporte_sofom.txt");
    res.send(texto);
  }catch (err) {
    console.error(err);
    res.status(500).send("Error al exportar TXT");
  }
};
//mostrar reportes
exports.get_reportes = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM public."Reporte"
      ORDER BY fecha_generacion DESC
    `);

    res.render("reportes", {
      pageTitle: "Reportes - Beta 1",
      reportes: resultado.rows,
      usuarioSesion: req.session.usuario,
      csrfToken: res.locals.csrfToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener reportes");
  }
};

exports.post_crear = async (req, res) => {
  try {
    const { tipo } = req.body;

    await pool.query(`
      INSERT INTO public."Reporte"
      (
        id_reporte,
        tipo,
        fecha_generacion,
        estatus_envio
      )
      VALUES
      (
        $1,
        $2,
        NOW(),
        'Pendiente'
      )
    `, [
      Math.floor(Math.random() * 100000),
      tipo
    ]);

    res.redirect("/reportes");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear reporte");
  }
};
exports.enviarReporte=async(req,res)=>{
  try{
    const {id} = req.params;
    await pool.query(`
      UPDATE public."Reporte"
      SET
        estatus_envio ='Enviado',
        fecha_envio=NOW()
      WHERE id_reporte =$1
    `,[id]);
    res.redirect("/reportes");
  }catch(err){
    console.error(err);
    res.status(500).send("Error al enviar reporte");
  }
};

exports.getEstatusReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(`
      SELECT
        id_reporte,
        folio,
        estatus_envio,
        fecha_envio
      FROM public."Reporte"
      WHERE id_reporte = $1
    `, [id]);
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener estatus" });
  }
};

exports.delete_reporte = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`
      DELETE FROM public."Reporte"
      WHERE id_reporte = $1
    `, [id]);

    res.redirect("/reportes");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar reporte");
  }
};

exports.actualizarEstatus=async(req, res)=>{
try {
  const { id }=req.params;
  const { estatus_envio }=req.body;
  await pool.query(
    `UPDATE public."Reporte"
    SET estatus_envio=$1
    WHERE id_reporte = $2`,
    [estatus_envio, id]
  );
  //volver a buscar el reporte
  const resultado=await pool.query(
    `SELECT *
    FROM public."Reporte"
    WHERE id_reporte=$1`,
    [id]
  );
  if(resultado.rows.length==0){
    return res.status(404).json({
      error: "Reporte no encontrado"
    });
  }
  res.json({mensaje:"Estatus actualizado",
    reporte: resultado.rows[0]
  });
}catch (error){
  log(error);
  res.status(500).json({
    error: "Error al actualizar"
  });
}
};
