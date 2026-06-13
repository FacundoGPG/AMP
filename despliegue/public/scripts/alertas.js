let gridAlertas;
let alertasCargadas = [];
let alertasFiltradas = [];
let alertaSeleccionada = null;

async function cargarAlertas() {
  const AlertasContainer = document.getElementById("alertas-table");
  if (!AlertasContainer) return;

  try {
    const response = await fetch("/api/alertas");
    alertasCargadas = await response.json();
    alertasFiltradas = alertasCargadas;
  } catch (error) {
    console.log("Error al cargar alertas", error);
    alertasCargadas = [];
    alertasFiltradas = [];
  }

  if (gridAlertas) {
    gridAlertas.updateConfig({ data: obtenerDataAlertas() }).forceRender();
    setTimeout(agregarClickAlertas, 300);
    return;
  }

  gridAlertas = new gridjs.Grid({
    columns: ["ID Alerta", "Fecha", "Cliente", "Tipo de Alerta", "Motivo", "Prioridad", "Estatus"],
    data: obtenerDataAlertas(),
    search: false,
    sort: true,
    pagination: { limit: 10 }
  }).render(AlertasContainer);

  setTimeout(agregarClickAlertas, 300);
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

function agregarClickAlertas() {
  const rows = document.querySelectorAll("#alertas-table tbody .gridjs-tr");

  rows.forEach(row => {
    row.style.cursor = "pointer";
    row.addEventListener("click", () => {
      // Quitar highlight anterior
      document.querySelectorAll("#alertas-table tbody .gridjs-tr").forEach(r => {
        r.style.background = "";
      });
      // Highlight de fila seleccionada
      row.style.background = "var(--color-shadow)";

      const idAlerta = Number(row.children[0].textContent.trim());
      alertaSeleccionada = alertasCargadas.find(a => a.id_alerta === idAlerta);
      if (!alertaSeleccionada) return;

      // Llenar panel
      document.getElementById("alerta-detail-id").textContent = `Alerta #${alertaSeleccionada.id_alerta}`;
      document.getElementById("alerta-detail-tipo").textContent = alertaSeleccionada.tipo_alerta;
      document.getElementById("alerta-detail-prioridad").textContent = alertaSeleccionada.prioridad || "—";
      document.getElementById("alerta-detail-estatus").textContent = alertaSeleccionada.estatus;
      document.getElementById("alerta-detail-fecha").textContent =
        alertaSeleccionada.fecha_generacion
          ? new Date(alertaSeleccionada.fecha_generacion).toLocaleString("es-MX") : "---";
      document.getElementById("alerta-detail-cliente").textContent = alertaSeleccionada.cliente || "Sin cliente";
      document.getElementById("alerta-detail-motivo").textContent = alertaSeleccionada.motivo;
      document.getElementById("alertaPanel")?.classList.add("active");
      document.getElementById("alertaOverlay")?.classList.add("active");

    });
  });
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

    const coincideTipo = tipo === "" || a.tipo_alerta === tipo;
    const coincideEstatus = estatus === "" || a.estatus === estatus;
    const fecha = new Date(a.fecha_generacion);
    const coincideFechaDesde = !dateFrom || fecha >= new Date(dateFrom);
    const coincideFechaHasta = !dateTo || fecha <= new Date(dateTo);

    return coincideTexto && coincideTipo && coincideEstatus && coincideFechaDesde && coincideFechaHasta;
  });
  alertasFiltradas = filtradas;

  gridAlertas.updateConfig({
    data: filtradas.map(a => [
      a.id_alerta,
      a.fecha_generacion ? new Date(a.fecha_generacion).toLocaleString("es-MX") : "",
      a.cliente,
      a.tipo_alerta,
      a.motivo,
      a.prioridad || "—",
      a.estatus
    ])
  }).forceRender();

  setTimeout(agregarClickAlertas, 300);
}

function cleanFiltros() {
  document.getElementById("searchClient").value = "";
  document.getElementById("dateFrom").value = "";
  document.getElementById("dateTo").value = "";
  document.getElementById("filterType").value = "";
  document.getElementById("filterStatus").value = "";
  gridAlertas.updateConfig({ data: obtenerDataAlertas() }).forceRender();
  alertasFiltradas = alertasCargadas;
  setTimeout(agregarClickAlertas, 300);
}

function iniciarExportacionAlertas() {
  const exportBtn = document.getElementById("exportAlertasCSV");
  if (!exportBtn) return;

  exportBtn.addEventListener("click", () => {
    exportarCSV({
      nombreBase: "alertas_filtradas",
      delimiter: ",",
      fields: [
        { label: "ID Alerta", value: "id_alerta" },
        { label: "Fecha", value: "fecha_generacion" },
        { label: "Cliente", value: "cliente" },
        { label: "Tipo de Alerta", value: "tipo_alerta" },
        { label: "Motivo", value: "motivo" },
        { label: "Prioridad", value: "prioridad" },
        { label: "Estatus", value: "estatus" }
      ],
      data: alertasFiltradas
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarAlertas();

  document.getElementById("applyFilters")?.addEventListener("click", applyFiltersAlertas);
  document.getElementById("clearFilters")?.addEventListener("click", cleanFiltros);
  iniciarExportacionAlertas();

  // Cerrar panel alerta
  document.getElementById("cerrarAlertaPanel")?.addEventListener("click", () => {
    document.getElementById("alertaPanel")?.classList.remove("active");
    document.getElementById("alertaOverlay")?.classList.remove("active");
    document.querySelectorAll("#alertas-table tbody .gridjs-tr").forEach(r => {
      r.style.background = "";
    });
    alertaSeleccionada = null;
  });

  // Botón crear caso desde panel de alerta
  document.getElementById("btn-crear-caso-desde-alerta")?.addEventListener("click", () => {
    if (!alertaSeleccionada) return;
    // Redirigir a casos con la alerta como query param
    window.location.href = `/casos?idAlerta=${alertaSeleccionada.id_alerta}&motivo=${encodeURIComponent(alertaSeleccionada.motivo)}`;
  });
});
