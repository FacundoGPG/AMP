const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const pool = require("../config/database");
const { subirArchivo } = require("../config/storage");
const clientesModel = require("../models/clientes.model");

//mostrar página del formulario
exports.renderChisme = async (req, res) => {
    const roles = req.session.usuario?.roles || [];

    if (roles.includes("Cliente")) {
        const id_usuario = req.session.usuario?.id;
        const tienePendiente = await clientesModel.tienePendiente(id_usuario);

        return res.render("cliente", {
            pageTitle: "Portal del Cliente",
            enviado:   req.query.enviado === "true",
            pendiente: tienePendiente
        });
    }

    res.render("chisme", {
        pageTitle: "Chisme - Beta 1",
        hash: req.query.hash || null
    });
};

// Multer en memoria — el archivo nunca toca el disco
const uploadMemoria = multer({ storage: multer.memoryStorage() }).single("file");

exports.upload_documento_cliente = async (req, res) => {
  uploadMemoria(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al recibir el archivo");
    }

    const id_usuario = req.session.usuario?.id;
    if (!id_usuario) return res.status(401).send("No autenticado");

    // Verificar que no tenga un documento pendiente
    const tienePendiente = await clientesModel.tienePendiente(id_usuario);
    if (tienePendiente) {
      return res.render("cliente", {
        pageTitle: "Portal del Cliente",
        enviado: false,
        pendiente: true
      });
    }

    if (!req.file) return res.status(400).send("No se recibió ningún archivo");

    try {
      // Subir a Supabase Storage
      const { url, ruta } = await subirArchivo(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      const datos_cliente = {
        nombre:       req.body.nombre?.trim(),
        tipo_persona: req.body.tipo_persona,
        rfc:          req.body.rfc?.trim().toUpperCase(),
        curp:         req.body.curp?.trim().toUpperCase(),
        correo:       req.body.correo?.trim().toLowerCase(),
        telefono:     req.body.telefono?.trim(),
        domicilio:    req.body.domicilio?.trim()
      };

      await clientesModel.addDocumentoCliente({
        id_usuario,
        nombre_archivo: req.file.originalname,
        ruta_archivo:   url,
        datos_cliente
      });

      return res.redirect("/testing?enviado=true");
    } catch (error) {
      console.error("Error guardando documento:", error);
      return res.status(500).send("Error al guardar el documento");
    }
  });
};




// CONFIGURACIÓN PUBLIC


const storage = multer.diskStorage({

    destination: function (req, file, callback) {

        console.log("File Destination:", "./public/");

        callback(null, "./public/");
    },

    filename: function (req, file, callback) {

        console.log("Uploaded File:", req.body);

        callback(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
}).array("file", 1);







exports.upload_file = async (req, res) => {

    upload(req, res, function (err) {

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
  uploadMemoria(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ code: 500, msg: "Error uploading file" });
    }

    const descripcion = req.body.mensaje || "";
    const situacion   = req.body.nombre  || "Sin título";

    if (!descripcion.trim()) {
      return res.status(400).send("La descripción es obligatoria");
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

    const filePath = path.join(
        __dirname,
        "../private",
        fileName
    );

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

