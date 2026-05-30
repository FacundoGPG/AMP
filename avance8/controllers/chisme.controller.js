exports.renderChisme = (req, res) => {

    const rol = req.session.usuario?.rol;

    if (rol === 'Cliente') {
        return res.render("cliente", { pageTitle: "Portal del Cliente" });
    }

    res.render("chisme", {
        pageTitle: "Chisme - Beta 1"
    });
};

const multer = require("multer");
const path = require("path");

/* =========================
   CONFIGURACIÓN PUBLIC
========================= */

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

/* =========================
   CONFIGURACIÓN PRIVATE
========================= */

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

/* =========================
   SUBIR ARCHIVO PUBLIC
========================= */

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

/* =========================
   SUBIR ARCHIVO PRIVATE
========================= */

exports.upload_file_private = async (req, res) => {

    upload2(req, res, function (err) {

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

/* =========================
   OBTENER ARCHIVO PRIVATE
========================= */

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