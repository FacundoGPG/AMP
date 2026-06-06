let gridHistorial;
let historialCargado = [];

function statusBadge(estado) {
  const clases = {
    "Activo":     "badge bg-success",
    "Revisado":   "badge bg-primary",
    "Completado": "badge bg-warning text-dark",
    "Pendiente":  "badge bg-secondary",
    "Consulta":   "badge bg-info text-dark",
  };
  return clases[estado] || "badge bg-secondary";
}

function obtenerDataHistorial() {
  return historialCargado.map(h => [
    h.id_historial,
    h.usuario,
    h.actividad,
    h.modulo,
    h.fecha ? new Date(h.fecha).toLocaleString("es-MX") : "",
    gridjs.html(`<span class="${statusBadge(h.estado)}">${h.estado || ""}</span>`)
  ]);
}

async function cargarHistorial() {
  const container = document.getElementById("history-table");
  if (!container) return;

  try {
    const response = await fetch("/api/historial");
    historialCargado = await response.json();
  } catch (error) {
    console.error("Error al cargar historial:", error);
    historialCargado = [];
  }

  if (gridHistorial) {
    gridHistorial.updateConfig({ data: obtenerDataHistorial() }).forceRender();
    return;
  }

  gridHistorial = new gridjs.Grid({
    columns: [
      "ID",
      "Usuario",
      "Actividad",
      "Módulo",
      "Fecha",
      "Estado"
    ],
    data: obtenerDataHistorial(),
    search: { placeholder: "Buscar actividad..." },
    sort: true,
    pagination: { limit: 5 }
  }).render(container);
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarHistorial();
});