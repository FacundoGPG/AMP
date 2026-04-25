const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const { response } = require('express');

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('login');
});

app.get("/health", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ status: "ok" });
});

const rutasUsuarios = require('./routes/usuarios.routes');
app.use('/usuarios', rutasUsuarios);

app.post("/responder", (req, res) => {
    const respuestaUsuario = req.body.respuesta;
    res.send("Tu respuesta fue: " + respuestaUsuario);
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Dashboard', 'Dashboard.html'));
});
app.get('/operations', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Operations', 'Operations.html'));
});
app.get('/alertas', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Alertas', 'Alertas.html'));
});
console.log("RUTA DASHBOARD CARGADA");

app.get('/dashboard', (req, res) => {
    res.send("Sí entró a dashboard");
});
app.listen(5555);