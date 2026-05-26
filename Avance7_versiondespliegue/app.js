require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const { doubleCsrf } = require("csrf-csrf");

const app = express();

/* =========================
   CONFIGURACIÓN EJS
========================= */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));

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
    secret:
      process.env.SESSION_SECRET ||
      "mi string secreto largo para desarrollo",

    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    }
  })
);

app.use((req, res, next) => {

    res.locals.usuarioSesion =
        req.session.usuario || null;

    next();
});

app.use(express.static(path.join(__dirname, "public")));

/* =========================
   CSRF
========================= */

const {
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "cambia-esto-en-desarrollo",
  getSessionIdentifier: (req) => req.sessionID,
  cookieName: "x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  },
  getCsrfTokenFromRequest: (req) =>
    req.body._csrf || req.headers["x-csrf-token"]
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

  const csrfToken = generateCsrfToken(req, res);

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
   SERVER (configurado para Vercel)
========================= */

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});