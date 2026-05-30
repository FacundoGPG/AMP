document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/historial");
  const historial = await response.json();

  const data = historial.map(h => [
    h.ID,
    h.Usuario,
    h.Actividad,
    h.Modulo,
    h.Fecha ? new Date(h.Fecha).toLocaleString("es-MX") : "",
    gridjs.html(getBadge(h.Estado))
  ]);

  new gridjs.Grid({
    columns: ["ID", "Usuario", "Actividad", "Módulo", "Fecha", "Estado"],
    data: data,
    search: { placeholder: "Buscar actividad..." },
    sort: true,
    pagination: { limit: 10 }
  }).render(document.getElementById("history-table"));
});

function getBadge(estado) {
  const map = {
    "Activo":     '<span class="badge bg-success">Activo</span>',
    "Revisado":   '<span class="badge bg-primary">Revisado</span>',
    "Completado": '<span class="badge bg-warning text-dark">Completado</span>',
    "Pendiente":  '<span class="badge bg-secondary">Pendiente</span>',
    "Consulta":   '<span class="badge bg-info text-dark">Consulta</span>',
  };
  return map[estado] || `<span class="badge bg-light text-dark">${estado}</span>`;
}