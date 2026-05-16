let gridAlertas;

const alertas = [
  ["AL-0001", "2025-05-24 13:45", "Ana López", "Transacción inusual", "Transferencia por monto elevado detectada.", "Alta", "En revisión"],
  ["AL-0002", "2025-05-24 12:30", "Empresa X", "Patrón inusual", "Múltiples operaciones fraccionadas.", "Media", "Abierta"],
  ["AL-0003", "2025-05-24 11:15", "Juan Pérez", "Datos inconsistentes", "Discrepancias en Informacion", "Alta", "En revisión"],
  ["AL-0004", "2025-05-24 10:05", "Carlos Ruiz", "Actividad sospechosa", "Conexion con Terrorismo", "Alta", "Abierta"]
];

document.addEventListener("DOMContentLoaded", () => {

  const tableContainer = document.getElementById("alertas-table");
  const applyBtn = document.getElementById("applyFilters");
  const clearBtn = document.getElementById("clearFilters");

  if (!tableContainer || !applyBtn || !clearBtn) {
    console.log("Falta algún elemento del HTML");
    return;
  }

  gridAlertas = new gridjs.Grid({
    columns: [
      "ID Alerta",
      "Fecha",
      "Cliente",
      "Tipo de Alerta",
      "Descripción",
      "Prioridad",
      "Estatus"
    ],
    data: alertas,
    search: false,
    sort: true,
    pagination: {
      limit: 10
    }
  }).render(tableContainer);

  applyBtn.addEventListener("click", aplicarFiltros);
  clearBtn.addEventListener("click", limpiarFiltros);

});

function aplicarFiltros() {

  const texto = document.getElementById("searchClient").value.toLowerCase().trim();
  const tipo = document.getElementById("filterType").value.trim();
  const estatus = document.getElementById("filterStatus").value.trim();

  const dateFrom = document.getElementById("dateFrom").value;
  const dateTo = document.getElementById("dateTo").value;

  const filtradas = alertas.filter((a) => {

    const coincideTexto =
      texto === "" ||
      a[0].toLowerCase().includes(texto) ||
      a[2].toLowerCase().includes(texto);

    const coincideTipo =
      tipo === "" || a[3] === tipo;

    const coincideEstatus =
      estatus === "" || a[6] === estatus;

    const fechaAlerta = new Date(a[1]);

    const coincideFechaDesde =
      !dateFrom || fechaAlerta >= new Date(dateFrom);

    const coincideFechaHasta =
      !dateTo || fechaAlerta <= new Date(dateTo);

    return (
      coincideTexto &&
      coincideTipo &&
      coincideEstatus &&
      coincideFechaDesde &&
      coincideFechaHasta
    );

  });

  gridAlertas.updateConfig({
    data: filtradas
  }).forceRender();

}

function limpiarFiltros() {

  document.getElementById("searchClient").value = "";
  document.getElementById("dateFrom").value = "";
  document.getElementById("dateTo").value = "";
  document.getElementById("filterType").value = "";
  document.getElementById("filterStatus").value = "";

  gridAlertas.updateConfig({
    data: alertas
  }).forceRender();

}