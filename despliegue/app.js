require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const fs = require("fs");

const { doubleCsrf } = require("csrf-csrf");

const app = express();

/* =========================
   CREAR CARPETA PRIVATE
========================= */

/* fs.mkdirSync(
  path.join(__dirname, "private"),
  { recursive: true }
);
*/ 


exports.get_private_file = async (req, res) => {
  const fileName = path.basename(req.params.file);
  const filePath = path.join(__dirname, "../private", fileName);

  res.sendFile(filePath, (err) => {
    if (err) {
      return res.status(404).json({ code: 404, msg: "Archivo no encontrado" });
    }
  });
};

/* =========================
   CONFIGURACIÓN EJS
========================= */

app.set("view engine", "ejs");

app.set(
  "views",
  path.join(__dirname, "public")
);

/* =========================
   MIDDLEWARES
========================= */

app.use(cors({
  origin: ["http://localhost:3001"],
  credentials: true
}));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {

        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com"
        ],

        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com"
        ],

        "font-src": [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com"
        ],

        "img-src": [
          "'self'",
          "data:",
          "https:"
        ]
      }
    }
  })
);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.set("trust proxy", 1);

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    }
  })
);

app.use((req, res, next) => {

  res.locals.usuarioSesion =
    req.session.usuario || null;

  next();
});

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

/* =========================
   CSRF
========================= */

const {
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf({

  getSecret: () =>
    process.env.CSRF_SECRET ||
    "cambia-esto-en-desarrollo",

  getSessionIdentifier: (req) =>
    req.sessionID,

  cookieName: "x-csrf-token",

  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  },

  getCsrfTokenFromRequest: (req) =>
    req.body._csrf ||
    req.headers["x-csrf-token"]
});

/* =========================
   PROTECCIÓN CSRF
========================= */
/*
app.use((req, res, next) => {

  if (["POST", "PUT", "DELETE"].includes(req.method)) {

    console.log("BODY:", req.body);

    console.log("CSRF:", req.body._csrf);

    console.log("COOKIES:", req.cookies);

    return doubleCsrfProtection(req, res, next);
  }

  next();
});
*/

/* =========================
   RUTAS PRINCIPALES
========================= */

app.get("/", (req, res) => {

  const csrfToken =
    generateCsrfToken(req, res);

  res.render("login", {
    csrfToken
  });
});

app.get("/health", (req, res) => {

  res.status(200).json({
    status: "ok"
  });
});

/* =========================
   RUTAS DE PRUEBA
========================= */

app.get("/test_ejs", (req, res) => {

  res.render("usuarios/login");
});

/* =========================
   COOKIES
========================= */

app.get("/test_cookie", (req, res) => {

  res.setHeader(
    "Content-Type",
    "text/plain"
  );

  res.setHeader(
    "Set-Cookie",
    "mi_cookie=123; HttpOnly"
  );

  res.send("Hola Mundo");
});

app.get("/test_value_cookie", (req, res) => {

  res.setHeader(
    "Content-Type",
    "text/plain"
  );

  res.send(
    req.cookies.mi_cookie ||
    "No existe la cookie"
  );
});

/* =========================
   SESIONES
========================= */

app.get("/test_session", (req, res) => {

  req.session.mi_variable = "valor";

  res.setHeader(
    "Content-Type",
    "text/plain"
  );

  res.send(req.session.mi_variable);
});

app.get("/test_session_variable", (req, res) => {

  res.setHeader(
    "Content-Type",
    "text/plain"
  );

  res.send(
    req.session.mi_variable ||
    "No existe la variable de sesión"
  );
});

app.get("/logout", (req, res) => {

  req.session.destroy(() => {

    res.redirect("/");
  });
});

/* =========================
   PREGUNTAS
========================= */

app.get("/preguntas", (req, res) => {

  res.render("preguntas");
});

/* =========================
   BACKEND ROUTES
========================= */

app.use(
  "/usuarios",
  require("./routes/usuarios.routes")
);

app.use(
  "/reportes",
  require("./routes/reportes.routes")
);

/* =========================
   FRONTEND ROUTES
========================= */

app.use(
  "/",
  require("./routes/dashboard.routes")
);

app.use(
  "/",
  require("./routes/clientes.routes")
);

app.use(
  "/",
  require("./routes/chisme.routes")
);

app.use(
  "/",
  require("./routes/operations.routes")
);

app.use(
  "/",
  require("./routes/alertas.routes")
);

app.use(
  "/",
  require("./routes/buzon.routes")
);

app.use(
  "/",
  require("./routes/history.routes")
);

/* =========================
   SERVER
========================= */

if (process.env.NODE_ENV !== "production") {
  app.listen(3001, () => {
    console.log("http://localhost:3001");
  });
}

module.exports = app;
