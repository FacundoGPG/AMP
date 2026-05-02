document.addEventListener("DOMContentLoaded", () => {
  const tableContainer = document.getElementById("alertas-table");

  const alertas = [
    ["AL-0001", "2025-05-24 13:45", "Ana López", "Transacción inusual", "Transferencia por monto elevado detectada.", "Alta", "En revisión"],
    ["AL-0002", "2025-05-24 12:30", "Empresa X", "Patrón inusual", "Múltiples operaciones fraccionadas.", "Media", "Abierta"],
    ["AL-0003", "2025-05-24 11:15", "Juan Pérez", "Datos inconsistentes", "Discrepancias en Informacion", "Alta", "En revisión"],
    ["AL-0004", "2025-05-24 10:05", "Carlos Ruiz", "Actividad sospechosa", "Conexion con Terrorismo", "Alta", "Abierta"]
  ];

  new gridjs.Grid({
    columns: ["ID Alerta", "Fecha", "Cliente", "Tipo de Alerta", "Descripción", "Prioridad", "Estatus"],
    data: alertas,
    search: false,
    sort: true,
    pagination: { limit: 10 }
  }).render(tableContainer);
});