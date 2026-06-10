//nuevo
//para subir archivos
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

//para base de datos
const pool = require("../config/database");

//mostrar página del formulario
exports.renderChisme = (req, res) => {
    const roles = req.session.usuario?.roles || [];

    if (roles.includes("Cliente")) {
        return res.render("cliente", { pageTitle: "Portal del Cliente" });
    }

    res.render("chisme", {
        pageTitle: "Chisme - Beta 1",
        hash: req.query.hash || null
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


// CONFIGURACIÓN PRIVATE


const storage2 = multer.diskStorage({

    destination: function (req, file, callback) {

        callback(null, "./private/");
    },

    filename: function (req, file, callback) {

        callback(null, file.originalname);
    }
});

const upload2 = multer({
    storage: storage2
}).array("file", 1);


//   SUBIR ARCHIVO PUBLIC


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


//  SUBIR ARCHIVO PRIVATE


exports.upload_file_private = async (req, res) => {

    upload2(req, res, async function (err) {

        if (err) {
            console.error(err);
            return res.status(500).json({ code: 500, msg: "Error uploading file" });
        }

        const descripcion = req.body.mensaje || "";
        const situacion = req.body.nombre || "Sin título";

        if (!descripcion.trim()) {
            return res.status(400).send("La descripción es obligatoria");
        }

        let rutaEvidencia = null;
        if (req.files && req.files.length > 0) {
            rutaEvidencia = "/private/" + req.files[0].originalname;
        }

        // Generar hash anónimo SHA-256
        const hash = crypto
            .createHash("sha256")
            .update(crypto.randomUUID())
            .digest("hex");

        try {
            // 1. Insertar en Alerta
            const resultAlerta = await pool.query(`
                INSERT INTO public."Alerta"
                (tipo_alerta, fecha_generacion, motivo, estatus)
                VALUES ('Buzon', NOW(), $1, 'Nueva')
                RETURNING id_alerta
            `, [situacion]);

            const idAlerta = resultAlerta.rows[0].id_alerta;

            // 2. Insertar en Alerta_Buzon con el ID generado
            await pool.query(`
                INSERT INTO public."Alerta_Buzon"
                (id_alerta, descripcion_reporte, ruta_evidencia, hash_seguimiento, estatus)
                VALUES ($1, $2, $3, $4, 'Pendiente')
            `, [idAlerta, descripcion, rutaEvidencia, hash]);

            console.log("Reporte anónimo guardado. Hash:", hash);

            // 3. Redirigir con el hash como confirmación
            return res.redirect(`/testing?hash=${hash}`);

        } catch (errorBD) {
            console.error("Error en la base de datos:", errorBD);
            return res.status(500).send("Error al guardar el reporte");
        }
    });
};


 //  OBTENER ARCHIVO PRIVATE


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
