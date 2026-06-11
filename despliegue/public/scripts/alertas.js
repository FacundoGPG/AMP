let gridAlertas;
let AlertasCargadas = [];


async function cargarAlertas() { 
  const AlertasContainer = document.getElementById("alertas-table");
  if (!AlertasContainer) return;

  try {
    const response = await fetch("/api/alertas");
    alertasCargadas = await response.json();
  }catch (error) {
    console.log("Error al cargar alertas", error);
    alertasCargadas = [];
  }

  if (gridAlertas) {
    gridAlertas.updateConfig( { data: obtenerDataAlertas() }).forceRender();
    return;
  }

  gridAlertas = new gridjs.Grid({
    columns: [
      "ID Alerta",
      "Fecha",
      "Cliente",      
      "Tipo de Alerta",
      "Motivo",
      "Prioridad",
      "Estatus"
    ],
    data: obtenerDataAlertas(),
    search: false,
    sort: true,
    pagination: { limit: 10 }
  }).render(AlertasContainer);
}


function obtenerDataAlertas() {
  return alertasCargadas.map(a => [
    a.id_alerta,
    a.fecha_generacion ? new Date(a.fecha_generacion).toLocaleString("es-MX") : "",
    a.cliente, 
    a.tipo_alerta,
    a.motivo,
    a.prioridad || "—",
    a.estatus
  ]);
}

function applyFiltersAlertas() {
  const texto = document.getElementById("searchClient").value.toLowerCase().trim();
  const tipo = document.getElementById("filterType").value.trim();
  const estatus = document.getElementById("filterStatus").value.trim();
  const dateFrom = document.getElementById("dateFrom").value;
  const dateTo = document.getElementById("dateTo").value;

  const filtradas = alertasCargadas.filter(a => {
    const coincideTexto =
      texto === "" ||
      String(a.id_alerta).includes(texto) ||
      (a.motivo && a.motivo.toLowerCase().includes(texto)) ||
      (a.cliente && a.cliente.toLowerCase().includes(texto));

    const coincideTipo =
      tipo === "" || a.tipo_alerta === tipo;

    const coincideEstatus =
      estatus === "" || a.estatus === estatus;

    const fecha = new Date(a.fecha_generacion);
    const coincideFechaDesde = !dateFrom || fecha >= new Date(dateFrom);
    const coincideFechaHasta = !dateTo || fecha <= new Date(dateTo);

    return coincideTexto && coincideTipo && coincideEstatus && coincideFechaDesde && coincideFechaHasta;
  });

  gridAlertas.updateConfig({
    data: filtradas.map(a => [
      a.id_alerta,
      a.fecha_generacion ? new Date(a.fecha_generacion).toLocaleString("es-MX") : "",
      a.cliente,       // ← agrégalo
      a.tipo_alerta,
      a.motivo,
      a.prioridad || "—",
      a.estatus
    ])
  }).forceRender();
}



function cleanFiltros() {
  document.getElementById("searchClient").value = "";
  document.getElementById("dateFrom").value = "";
  document.getElementById("dateTo").value = "";
  document.getElementById("filterType").value = "";
  document.getElementById("filterStatus").value = "";

  gridAlertas.updateConfig({ data: obtenerDataAlertas() }).forceRender();
}

document.addEventListener("DOMContentLoaded", async () => {
  const applyBtn = document.getElementById("applyFilters");
  const clearBtn = document.getElementById("clearFilters");

  await cargarAlertas();

  if (applyBtn) applyBtn.addEventListener("click", applyFiltersAlertas);
  if (clearBtn) clearBtn.addEventListener("click", cleanFiltros);
});
