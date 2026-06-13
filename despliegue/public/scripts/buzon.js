const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const pool = require("../config/database");
const { subirArchivo } = require("../config/storage");
const clientesModel = require("../models/clientes.model");

exports.renderChisme = async (req, res) => {
  const roles = req.session.usuario?.roles || [];

  if (roles.includes("Cliente")) {
    const idUsuario = req.session.usuario?.id;
    const pendiente = await clientesModel.tienePendiente(idUsuario);

    return res.render("cliente", {
      pageTitle: "Portal del Cliente",
      enviado: req.query.enviado === "true",
      pendiente
    });
  }

  res.render("chisme", {
    pageTitle: "Chisme - Beta 1",
    hash: req.query.hash || null
  });
};

const uploadPublico = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      console.log("File Destination:", "./public/");
      callback(null, "./public/");
    },
    filename: (req, file, callback) => {
      console.log("Uploaded File:", req.body);
      callback(null, file.originalname);
    }
  })
}).array("file", 1);

const uploadMemoria = multer({ storage: multer.memoryStorage() }).single("file");

exports.upload_documento_cliente = async (req, res) => {
  uploadMemoria(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al recibir el archivo");
    }

    const idUsuario = req.session.usuario?.id;
    if (!idUsuario) return res.status(401).send("No autenticado");

    const pendiente = await clientesModel.tienePendiente(idUsuario);
    if (pendiente) {
      return res.render("cliente", {
        pageTitle: "Portal del Cliente",
        enviado: false,
        pendiente: true
      });
    }

    if (!req.file) return res.status(400).send("No se recibio ningun archivo");

    try {
      const { url } = await subirArchivo(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      const datosCliente = {
        nombre: req.body.nombre?.trim(),
        tipo_persona: req.body.tipo_persona,
        rfc: req.body.rfc?.trim().toUpperCase(),
        curp: req.body.curp?.trim().toUpperCase(),
        correo: req.body.correo?.trim().toLowerCase(),
        telefono: req.body.telefono?.trim(),
        domicilio: req.body.domicilio?.trim()
      };

      // subirArchivo antepone un timestamp al nombre (ej: "1781304783912_test.pdf")
      // Se guarda el nombre original limpio para mostrarlo correctamente en el panel
      const nombreConTimestamp = url.split("/").pop().split("?")[0]; // "1781304783912_test.pdf"
      const nombreArchivo = nombreConTimestamp.replace(/^\d+_/, "");  // "test.pdf"

      await clientesModel.addDocumentoCliente({
        id_usuario: idUsuario,
        nombre_archivo: nombreArchivo,
        ruta_archivo: url,
        datos_cliente: datosCliente
      });

      return res.redirect("/testing?enviado=true");
    } catch (error) {
      console.error("Error guardando documento:", error);
      return res.status(500).send("Error al guardar el documento");
    }
  });
};

exports.upload_file = async (req, res) => {
  uploadPublico(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        code: 500,
        msg: "Error uploading file"
      });
    }

    console.log("Upload Successful:", req.files);
    res.redirect("/testing");
  });
};

exports.upload_file_private = async (req, res) => {
  uploadMemoria(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ code: 500, msg: "Error uploading file" });
    }

    const descripcion = req.body.mensaje || "";
    const situacion = req.body.nombre || "Sin titulo";

    if (!descripcion.trim()) {
      return res.status(400).send("La descripcion es obligatoria");
    }

    let rutaEvidencia = null;
    if (req.file) {
      try {
        const { url } = await subirArchivo(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        rutaEvidencia = url;
      } catch (storageError) {
        console.error("Error subiendo a Storage:", storageError);
        return res.status(500).send("Error al subir el archivo");
      }
    }

    const hash = crypto
      .createHash("sha256")
      .update(crypto.randomUUID())
      .digest("hex");

    try {
      const resultAlerta = await pool.query(`
        INSERT INTO public."Alerta"
          (tipo_alerta, fecha_generacion, motivo, estatus)
        VALUES ('Buzon', NOW(), $1, 'Nueva')
        RETURNING id_alerta
      `, [situacion]);

      const idAlerta = resultAlerta.rows[0].id_alerta;

      await pool.query(`
        INSERT INTO public."Alerta_Buzon"
          (id_alerta, descripcion_reporte, ruta_evidencia, hash_seguimiento, estatus)
        VALUES ($1, $2, $3, $4, 'Pendiente')
      `, [idAlerta, descripcion, rutaEvidencia, hash]);

      return res.redirect(`/testing?hash=${hash}`);
    } catch (errorBD) {
      console.error("Error en la base de datos:", errorBD);
      return res.status(500).send("Error al guardar el reporte");
    }
  });
};

exports.get_private_file = async (req, res) => {
  const fileName = path.basename(req.params.file);
  const filePath = path.join(__dirname, "../private", fileName);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("sendFile error:", err.message);
      res.status(404).json({
        code: 404,
        msg: "Archivo no encontrado"
      });
    }
  });
};