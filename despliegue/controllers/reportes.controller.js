const pool = require("../config/database");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const log = console.log;
// CSV
exports.exportarCSV = async (req, res) => {
  try {
    const resultado = await pool.query(sqlReportes);

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


// PDF
exports.exportarPDF = async (req, res) => {
  try {
    const resultado = await pool.query(sqlReportes);

    const doc = new PDFDocument();

    res.setHeader("Content-Disposition", "attachment; filename=reporte_sofom.pdf");
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Reporte SOFOM");
    doc.moveDown();

    resultado.rows.forEach(reporte => {
      doc.text("Folio: " + reporte.folio);
      doc.text("Fecha: " + reporte.fecha_generacion);
      doc.text("Cliente: " + reporte.nombre + " " + reporte.apellido_paterno);
      doc.text("RFC: " + reporte.rfc);
      doc.text("Monto: $" + reporte.monto);
      doc.text("Moneda: " + reporte.moneda);
      doc.text("Estatus: " + reporte.estatus_envio);
      doc.moveDown();
    });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al exportar PDF");
  }
};


// XML
exports.exportarXML = async (req, res) => {
  try {
    const resultado = await pool.query(sqlReportes);

    let xml = "";
    xml += `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<reportes>\n`;

    resultado.rows.forEach((reporte) => {
      xml += `  <reporte>\n`;
      xml += `    <folio>${reporte.folio}</folio>\n`;
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

    xml += `</reportes>`;

    res.header("Content-Type", "application/xml");
    res.attachment("reporte_sofom.xml");
    res.send(xml);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al exportar XML");
  }
};


// TXT
exports.exportarTXT = async (req, res) => {
  try {
    const resultado = await pool.query(sqlReportes);

    let texto = "";

    resultado.rows.forEach((reporte) => {
      texto += "Folio: " + reporte.folio + "\n";
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

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al exportar TXT");
  }
};


// Mostrar reportes
exports.get_reportes = async (req, res) => {
  try {
    const resultado = await pool.query(sqlReportes);

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


// Crear reporte
exports.post_crear = async (req, res) => {
  try {
    const { tipo } = req.body;

    await pool.query(sqlCrearReporte, [
      Math.floor(Math.random() * 100000),
      tipo
    ]);

    res.redirect("/reportes");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear reporte");
  }
};


// Enviar reporte
exports.enviarReporte = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(sqlEnviarReporte, [id]);

    res.redirect("/reportes");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al enviar reporte");
  }
};


// Obtener estatus
exports.getEstatusReporte = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(sqlEstatusReporte, [id]);

    res.json(resultado.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener estatus" });
  }
};


// Eliminar reporte
exports.delete_reporte = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(sqlEliminarReporte, [id]);

    res.redirect("/reportes");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar reporte");
  }
};


// Actualizar estatus
exports.actualizarEstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estatus_envio } = req.body;

    await pool.query(sqlActualizarEstatus, [estatus_envio, id]);

    const resultado = await pool.query(sqlBuscarReporte, [id]);

    if (resultado.rows.length == 0) {
      return res.status(404).json({
        error: "Reporte no encontrado"
      });
    }

    res.json({
      mensaje: "Estatus actualizado",
      reporte: resultado.rows[0]
    });

  } catch (error) {
    log(error);

    res.status(500).json({
      error: "Error al actualizar"
    });
  }
};