document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("reportes-table");
  if (!container) return;

  const reportes = [
    {
      id: "REP-24-0012",
      fecha: "22/05/2024 11:32",
      estatus: "Pendiente",
      descripcion: "Operación inusual en cuenta CLI-000123.",
      evidencia: "comprobante_operacion.pdf"
    },
    {
      id: "REP-24-0011",
      fecha: "21/05/2024 09:15",
      estatus: "En seguimiento",
      descripcion: "Posible estructura en múltiples transferencias.",
      evidencia: "detalle_transferencias.xlsx"
    },
    {
      id: "REP-24-0010",
      fecha: "20/05/2024 16:45",
      estatus: "Resuelto",
      descripcion: "Conducta sospechosa en retiros en efectivo.",
      evidencia: "reporte_retiros.pdf"
    }
  ];

  new gridjs.Grid({
    columns: [
      "ID del reporte",
      "Fecha",
      {
        name: "Estatus",
        formatter: (cell) => gridjs.html(`<span class="${getStatusClass(cell)}">${cell}</span>`)
      },
      "Descripción breve"
    ],
    data: reportes.map((r) => [r.id, r.fecha, r.estatus, r.descripcion]),
    search: false,
    sort: true,
    pagination: { limit: 5 },
    language: {
      pagination: {
        previous: "Anterior",
        next: "Siguiente",
        showing: "Mostrando",
        results: () => "resultados",
        of: "de",
        to: "a"
      }
    }
  }).render(container);

  setTimeout(() => agregarClickReportes(reportes), 300);
});

function getStatusClass(estatus) {
  if (estatus === "Pendiente") return "status pending";
  if (estatus === "En seguimiento") return "status tracking";
  if (estatus === "Resuelto") return "status solved";
  return "status";
}

function agregarClickReportes(reportes) {
  const rows = document.querySelectorAll("#reportes-table tbody .gridjs-tr");

  rows.forEach((row, index) => {
    row.style.cursor = "pointer";

    row.addEventListener("click", () => {
      const reporte = reportes[index];

      document.getElementById("detail-id").textContent = reporte.id;
      document.getElementById("detail-date").textContent = reporte.fecha;
      document.getElementById("detail-description").textContent = reporte.descripcion;
      document.getElementById("detail-select").value = reporte.estatus;

      const status = document.getElementById("detail-status");
      status.textContent = reporte.estatus;
      status.className = getStatusClass(reporte.estatus);

      document.querySelector(".file-item span").textContent = reporte.evidencia;
    });
  });
}