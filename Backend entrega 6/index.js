require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
/*nuevo*/
const rutasReportes = require('./routes/reportes.routes');
const cors = require('cors');
const { doubleCsrf } = require('csrf-csrf');
const helmet = require('helmet');
const rutasUsuarios = require('./routes/usuarios.routes');
const app = express();
const {
    generateCsrfToken,
    doubleCsrfProtection,
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || 'cambia-esto-en-desarrollo',
    getSessionIdentifier: (req) => req.sessionID,
    cookieName: 'x-csrf-token',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    },
    getCsrfTokenFromRequest: (req) =>
        req.body._csrf || req.headers['x-csrf-token']
});
app.use(cors({
    origin: [
        "http://localhost:5555",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
    ],
    credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            "style-src": ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'", "https://unpkg.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com", "https://unpkg.com"],
            "img-src": ["'self'", "data:", "https:"]
        }
    }
}));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: 'mi string secreto que debe ser un string aleatorio muy largo, no como éste',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//  genera el token para las vistas
// Genera el token solo en GET
app.use((req, res, next) => {
    if (req.method === "GET") {
        res.locals.csrfToken = generateCsrfToken(req, res);
    }
    next();
});
/*
app.use((req, res, next) => {
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
        return doubleCsrfProtection(req, res, next);
    }
    next();
});
*/
app.get('/', (req, res) => {
    res.cookie("mi_cookie", "123", {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });
    res.render('login', {
        csrfToken: res.locals.csrfToken
    });
});
app.use('/usuarios', rutasUsuarios);
app.use('/reportes', rutasReportes);
app.get("/health", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ status: "ok" });
});
app.post("/responder", (req, res) => {
    const respuestaUsuario = req.body.respuesta;
    res.send("Tu respuesta fue: " + respuestaUsuario);
});
app.get('/dashboard', (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'views', 'Dashboard', 'Dashboard.html'));
});
app.get('/operations', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Operations', 'Operations.html'));
});
app.get('/alertas', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Alertas', 'Alertas.html'));
});
console.log("RUTA CARGADA");
app.listen(5555, () => {
    console.log("Servidor en http://localhost:5555");
});