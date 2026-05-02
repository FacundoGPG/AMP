const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/dashboard.routes"));
app.use("/", require("./routes/clientes.routes"));
app.use("/", require("./routes/operations.routes"));
app.use("/", require("./routes/alertas.routes"));
app.use("/", require("./routes/buzon.routes"));

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});
app.listen(3001, () => {
  console.log(`http://localhost:3001`);
});

