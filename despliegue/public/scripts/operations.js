let gridOperaciones;
let operacionesData = [];
let operacionesFiltradas = [];

function normalizarFiltro(valor) {
  return String(valor || "").trim().toLowerCase();
}

function valorOperacion(op, campo) {
  const aliases = {
    ID_Operacion: ["ID_Operacion", "id_operacion"],
    Cliente: ["Cliente", "cliente"],
    Producto: ["Producto", "producto"],
    Tipo_Operacion: ["Tipo_Operacion", "tipo_operacion"],
    Monto: ["Monto", "monto"],
    Fecha: ["Fecha", "fecha"],
    Estado: ["Estado", "estado"],
    Canal: ["Canal", "canal"],
    Riesgo: ["Riesgo", "riesgo"]
  };

  const llave = aliases[campo]?.find((alias) => op[alias] !== undefined);
  return llave ? op[llave] : "";
}

function mapOperacionRow(op) {
  return [
    valorOperacion(op, "ID_Operacion"),
    valorOperacion(op, "Cliente"),
    valorOperacion(op, "Producto"),
    valorOperacion(op, "Tipo_Operacion"),
    valorOperacion(op, "Monto"),
    valorOperacion(op, "Fecha"),
    valorOperacion(op, "Estado"),
    valorOperacion(op, "Canal"),
    valorOperacion(op, "Riesgo")
  ];
}

document.addEventListener("DOMContentLoaded", () => {
  cargarTablaOperaciones();


  const applyBtn = document.getElementById("applyFiltersOp");
  const clearBtn = document.getElementById("clearFiltersOp");
  const exportBtn = document.getElementById("exportOperacionesCSV");

  if (applyBtn) applyBtn.addEventListener("click", applyOperacionFilters);
  if (clearBtn) clearBtn.addEventListener("click", cleanOperacionFiltros);
  if (exportBtn) exportBtn.addEventListener("click", exportarOperacionesFiltradas);

});


async function cargarTablaOperaciones() {
  const operacionesContainer = document.getElementById("operaciones-table");
  if (!operacionesContainer) return;

  const response = await fetch("/api/operaciones");
  operacionesData = await response.json();
  operacionesFiltradas = operacionesData;

gridOperaciones = new gridjs.Grid({
  columns: [
    "ID Operación",
    "Cliente", 
    "Producto",
    "Tipo",
    "Monto",
    {
      name: "Fecha",
      formatter: (cell) => cell ? new Date(cell).toLocaleString("es-MX") : ""
    },
    "Estatus",
    "Canal",
    "Riesgo"
  ],
  data: operacionesData.map(mapOperacionRow),
  sort: true,
  pagination: { limit: 10 }
}).render(operacionesContainer);
 
}

function applyOperacionFilters() {
  const texto = normalizarFiltro(document.getElementById("searchClientOp").value);
  const tipo = document.getElementById("filterTipoOp").value.trim();
  const producto = document.getElementById("filterProductoOp").value.trim();
  const riesgo = document.getElementById("filterRiesgoOp").value.trim();
  const canal = document.getElementById("filterCanalOp").value.trim();
  const estatus = document.getElementById("filterEstatusOp").value.trim();

  const dateFrom = document.getElementById("dateFromOp").value;
  const dateTo = document.getElementById("dateToOp").value;

  const filtradas = operacionesData.filter(op => {
    
    const coincideTexto =
      texto === "" ||
      normalizarFiltro(valorOperacion(op, "ID_Operacion")).includes(texto) ||
      normalizarFiltro(valorOperacion(op, "Cliente")).includes(texto);

    const coincideTipo = 
      tipo === "" || valorOperacion(op, "Tipo_Operacion") === tipo;
    const coincideProducto = 
      producto === "" || valorOperacion(op, "Producto") === producto;
    const coincideRiesgo = 
      riesgo === "" || normalizarFiltro(valorOperacion(op, "Riesgo")) === normalizarFiltro(riesgo);
    const coincideCanal = 
      canal === "" || valorOperacion(op, "Canal") === canal;
    const coincideEstatus = 
      estatus === "" || valorOperacion(op, "Estado") === estatus;


    const fechaOp = new Date(valorOperacion(op, "Fecha"));
    const coincideFechaDesde = 
      !dateFrom || fechaOp >= new Date(dateFrom);
    const coincideFechaHasta = 
      !dateTo || fechaOp <= new Date(dateTo);

    return (
      coincideTexto &&
      coincideTipo &&
      coincideProducto &&
      coincideCanal &&
      coincideEstatus &&
      coincideFechaDesde &&
      coincideFechaHasta &&
      coincideRiesgo
    );
  });

  operacionesFiltradas = filtradas;

  gridOperaciones.updateConfig({
    data: filtradas.map(mapOperacionRow)
  }).forceRender();
}

function cleanOperacionFiltros() {
  document.getElementById("searchClientOp").value = "";
  document.getElementById("dateFromOp").value = "";
  document.getElementById("dateToOp").value = "";
  document.getElementById("filterTipoOp").value = "";
  document.getElementById("filterProductoOp").value = "";
  document.getElementById("filterRiesgoOp").value = "";
  document.getElementById("filterCanalOp").value = "";
  document.getElementById("filterEstatusOp").value = "";
  operacionesFiltradas = operacionesData;

  gridOperaciones.updateConfig({
    data: operacionesData.map(mapOperacionRow)
  }).forceRender();
}

function exportarOperacionesFiltradas() {
  exportarCSV({
    nombreBase: "operaciones_filtradas",
    delimiter: ",",
    fields: [
      { label: "ID Operacion", value: (op) => valorOperacion(op, "ID_Operacion") },
      { label: "Cliente", value: (op) => valorOperacion(op, "Cliente") },
      { label: "Producto", value: (op) => valorOperacion(op, "Producto") },
      { label: "Tipo", value: (op) => valorOperacion(op, "Tipo_Operacion") },
      { label: "Monto", value: (op) => valorOperacion(op, "Monto") },
      { label: "Fecha", value: (op) => valorOperacion(op, "Fecha") },
      { label: "Estatus", value: (op) => valorOperacion(op, "Estado") },
      { label: "Canal", value: (op) => valorOperacion(op, "Canal") },
      { label: "Riesgo", value: (op) => valorOperacion(op, "Riesgo") }
    ],
    data: operacionesFiltradas
  });
}
