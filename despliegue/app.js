require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require('express-session')
const cors = require("cors");
const helmet = require("helmet");
const fs = require("fs");
const { doubleCsrf } = require("csrf-csrf");
const sesion = require("./config/sesion");
const pool = require("./config/database");
const app = express();

app.set("trust proxy", 1);

/* =========================
   CREAR CARPETA PRIVATE
========================= */
/*
fs.mkdirSync(
  path.join(__dirname, "private"),
  { recursive: true }
);
*/
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

app.use(
  session({
    store: process.env.DATABASE_URL
      ? new sesion()
      : undefined,

    secret:
      process.env.SESSION_SECRET ||
      "secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000
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
    process.env.CSRF_SECRET || "",

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

app.get("/logout", (req, res) => {
  req.session.destroy(() => {

    res.redirect("/");
  });
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

const server = app.listen(3001, () => {

  console.log(
    "http://localhost:3001"
  );
});

let isShuttingDown = false;

const shutdown = () => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  server.close(async () => {
    try {
      await pool.end();
    } catch (error) {
      console.error("Error closing PostgreSQL pool:", error);
    }

    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
