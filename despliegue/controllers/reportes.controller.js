const reportesModel = require("../models/reportes.model");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const log = console.log;

// Muestra la página de reportes
exports.get_reportes = async (req, res) => {
  try {
    const reportes = await reportesModel.getReportes();
    res.render("reportes", {
      pageTitle: "Reportes - Beta 1",
      reportes,
      usuarioSesion: req.session.usuario,
      csrfToken: res.locals.csrfToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener reportes");
  }
};

// Crea un reporte nuevo — ahora también recibe descripcion del formulario
exports.post_crear = async (req, res) => {
  try {
    const { tipo, titulo, descripcion, prioridad } = req.body;
    await reportesModel.createReporte({
      id_reporte: Math.floor(Math.random() * 100000),
      tipo,
      titulo,
      descripcion,
      prioridad
    });
    res.redirect("/reportes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear reporte");
  }
};

// Marca un reporte como enviado
exports.enviarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    await reportesModel.enviarReporte(id);
    res.redirect("/reportes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al enviar reporte");
  }
};

// Trae el estatus de un reporte en JSON
exports.getEstatusReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await reportesModel.getEstatusReporte(id);
    res.json(reporte);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener estatus" });
  }
};

// Elimina un reporte
exports.delete_reporte = async (req, res) => {
  try {
    const { id } = req.params;
    await reportesModel.deleteReporte(id);
    res.redirect("/reportes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar reporte");
  }
};

// Actualiza el estatus de un reporte
exports.actualizarEstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estatus_envio } = req.body;
    const reporte = await reportesModel.actualizarEstatus(id, estatus_envio);
    if (!reporte) {
      return res.status(404).json({ error: "Reporte no encontrado" });
    }
    res.json({ mensaje: "Estatus actualizado", reporte });
  } catch (error) {
    log(error);
    res.status(500).json({ error: "Error al actualizar" });
  }
};

// Exportar CSV
exports.exportarCSV = async (req, res) => {
  try {
    const reportes = await reportesModel.getReportes();
    const parser = new Parser({
      fields: ["id_reporte", "tipo", "titulo", "descripcion", "prioridad", "fecha_generacion", "estatus_envio"],
      delimiter: ","
    });
    res.header("Content-Type", "text/csv");
    res.attachment("reporte_sofom.csv");
    res.send(parser.parse(reportes));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al exportar CSV");
  }
};

// Exportar PDF
exports.exportarPDF = async (req, res) => {
  try {
    const reportes = await reportesModel.getReportes();
    const doc = new PDFDocument();
    res.setHeader("Content-Disposition", "attachment; filename=reporte_sofom.pdf");
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);
    doc.fontSize(18).text("Reporte SOFOM");
    doc.moveDown();
    reportes.forEach(r => {
      doc.text("Folio: "       + r.id_reporte);
      doc.text("Fecha: "       + r.fecha_generacion);
      doc.text("Tipo: "        + r.tipo);
      doc.text("Titulo: "      + (r.titulo      || "—"));
      doc.text("Descripcion: " + (r.descripcion || "—"));
      doc.text("Prioridad: "   + (r.prioridad   || "—"));
      doc.text("Estatus: "     + r.estatus_envio);
      doc.moveDown();
    });
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al exportar PDF");
  }
};

// Exportar XML
exports.exportarXML = async (req, res) => {
  try {
    const reportes = await reportesModel.getReportes();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<reportes>\n`;
    reportes.forEach(r => {
      xml += `  <reporte>\n`;
      xml += `    <folio>${r.id_reporte}</folio>\n`;
      xml += `    <fecha>${r.fecha_generacion}</fecha>\n`;
      xml += `    <tipo>${r.tipo}</tipo>\n`;
      xml += `    <titulo>${r.titulo || ""}</titulo>\n`;
      xml += `    <descripcion>${r.descripcion || ""}</descripcion>\n`;
      xml += `    <prioridad>${r.prioridad || ""}</prioridad>\n`;
      xml += `    <estatus_envio>${r.estatus_envio}</estatus_envio>\n`;
      xml += `  </reporte>\n`;
    });
    xml += `</reportes>`;
    res.header("Content-Type", "application/xml");
    res.attachment("reporte_sofom.xml");
    res.send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al exportar XML");
  }
};

// Exportar TXT
exports.exportarTXT = async (req, res) => {
  try {
    const reportes = await reportesModel.getReportes();
    let texto = "";
    reportes.forEach(r => {
      texto += "Folio: "       + r.id_reporte        + "\n";
      texto += "Fecha: "       + r.fecha_generacion  + "\n";
      texto += "Tipo: "        + r.tipo              + "\n";
      texto += "Titulo: "      + (r.titulo      || "—") + "\n";
      texto += "Descripcion: " + (r.descripcion || "—") + "\n";
      texto += "Prioridad: "   + (r.prioridad   || "—") + "\n";
      texto += "Estatus: "     + r.estatus_envio     + "\n";
      texto += "-----------------------------\n";
    });
    res.header("Content-Type", "text/plain");
    res.attachment("reporte_sofom.txt");
    res.send(texto);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al exportar TXT");
  }
};