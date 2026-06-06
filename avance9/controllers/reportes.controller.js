const pool = require("../config/database");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

/*const reportes = [
  {
    tipoReporte: "1",
    periodoReporte: "202605",
    folio: "000001",
    organoSupervisor: "000401",
    claveSujetoObligado: "0123456",
    localidad: "22014001",
    codigoPostal: "76000",
    tipoOperacion: "01",
    instrumentoMonetario: "01",
    numeroCuenta: "CTA001",
    monto: "15000.00",
    moneda: "MXN",
    fechaOperacion: "20260529",
    nombre: "Juan",
    apellidoPaterno: "Perez",
    apellidoMaterno: "Lopez",
    rfc: "PELJ000101ABC"
  }
];
*/

exports.exportarCSV = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM public."Reporte"
      ORDER BY fecha_generacion DESC
    `);
  //requisitos de reporte SOFOM campos
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
  res.status(500).send("Error al epxortas CSV");
 }
};

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

  reportes.forEach(reporte => {
    doc.text("Folio: " + reporte.folio);
    doc.text("Fecha: "+ reporte.fecha_generacion);
    doc.text("Cliente: " + reporte.nombre + " " + reporte.apellidoPaterno);
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
