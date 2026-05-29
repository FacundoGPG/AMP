let gridOperaciones;
let operacionesData = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarTablaOperaciones();
});

async function cargarTablaOperaciones() {
  const operacionesContainer = document.getElementById("operaciones-table");
  if (!operacionesContainer) return;

  const response = await fetch("/api/operaciones");
  operacionesData = await response.json();

  const applyBtn = document.getElementById("applyFiltersOp");
  const clearBtn = document.getElementById("clearFiltersOp");

  gridOperaciones = new gridjs.Grid({
    columns: ["ID Operación", "Cliente", "Producto", "Tipo", "Monto", "Fecha", "Estatus", "Canal", "Riesgo"],
    data: operacionesData.map(op => [
      op.ID_Operacion,
      op.Cliente,
      op.Producto,
      op.Tipo_Operacion,
      op.Monto,
      op.Fecha,
      op.Estado,
      op.Canal,
      op.Riesgo
    ]),
    sort: true,
    pagination: { limit: 10 }
  }).render(operacionesContainer);

  if (applyBtn) applyBtn.addEventListener("click", applyOperacionFilters);

}

function applyOperacionFilters() {
  const texto = document.getElementById("searchClientOp").value.toLowerCase().trim();
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
      String(op.ID_Operacion).toLowerCase().includes(texto) ||
      op.Cliente.toLowerCase().includes(texto);

    const coincideTipo = 
      tipo === "" || op.Tipo_Operacion === tipo;
    const coincideProducto = 
      producto === "" || op.Producto === producto;
    const coincideRiesgo = 
      riesgo === "" || op.Riesgo === riesgo;
    const coincideCanal = 
      canal === "" || op.Canal === canal;
    const coincideEstatus = 
      status === "" || op.Estado === estatus;


    const fechaOp = new Date(op.Fecha);
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
      coincideFechaHasta
    );
  });

  gridOperaciones.updateConfig({
    data: filtradas.map(op => [
      op.ID_Operacion,
      op.Cliente,
      op.Producto,
      op.Tipo_Operacion,
      op.Monto,
      op.Fecha,
      op.Estado,
      op.Canal,
      op.Riesgo
    ])
  }).forceRender();
}

