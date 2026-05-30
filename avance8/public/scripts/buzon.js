let gridReportes;
let reporteSeleccionado = null;

const reportes = [
  {
    id: "REP-0012",
    fecha: "22/05/2026 11:32",
    estatus: "Pendiente",
    descripcion: "Operación inusual en cuenta CLI-0007.",
    encargado: "Sin asignar" ,
    evidencia: "comprobante_operacion.pdf"
  },
  {
    id: "REP-0011",
    fecha: "21/05/2026 09:15",
    estatus: "En seguimiento",
    descripcion: "Posible estructura en múltiples transferencias.",
    encargado: "Sin asignar" ,
    evidencia: "detalle_transferencias.xlsx"
  },
  {
    id: "REP-0010",
    fecha: "20/05/2026 16:45",
    estatus: "Resuelto",
    descripcion: "Conducta sospechosa en retiros en efectivo.",
    encargado: "Sin asignar" ,
    evidencia: "reporte_retiros.pdf"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("reportes-table");
  if (!container) return;

  gridReportes = new gridjs.Grid({
    columns: [
      "ID del reporte",
      "Fecha",
      {
        name: "Estatus",
        formatter: (cell) =>
          gridjs.html(`<span class="${getStatusClass(cell)}">${cell || "Fecha Placeholder"}  </span>`)
      },
      {
        name: "Encargado",
        formatter: (cell) =>
          gridjs.html(`<span class="${getInchargeClass(cell)}">${cell || "Sin asignar"}</span>`)
      }
    ],
    data: obtenerDataReportes(),
    search: false,
    sort: true,
    pagination: { limit: 5 }
  }).render(container);

  setTimeout(agregarClickReportes, 300);

  const selectStatus = document.getElementById("detail-select");
  const selectEncargado = document.getElementById("detail-encargado");
  const status = document.getElementById("detail-status");

  if (selectStatus && status) {
    selectStatus.addEventListener("change", () => {
      if (!reporteSeleccionado) return;

      const nuevoEstatus = selectStatus.value;

      reporteSeleccionado.estatus = nuevoEstatus;

      status.textContent = nuevoEstatus;
      status.className = getStatusClass(nuevoEstatus);

      actualizarTablaReportes();
    });
  }

  if (selectEncargado) {
    selectEncargado.addEventListener("change", () => {
      if (!reporteSeleccionado) return;

      const nuevoEncargado = selectEncargado.value;

      reporteSeleccionado.encargado =
        nuevoEncargado || null;

      actualizarTablaReportes();
    });
  }
});



function actualizarTablaReportes() {
  gridReportes
    .updateConfig({
      data: obtenerDataReportes()
    })
    .forceRender();

  setTimeout(agregarClickReportes, 300);
}

function getInchargeClass(encargado) {

}

function obtenerDataReportes() {
  return reportes.map((r) => [
    r.id,
    r.fecha,
    r.estatus,
    r.encargado
  ]);
}

function getStatusClass(estatus) {
  if (estatus === "Pendiente") return "status pending";
  if (estatus === "En seguimiento") return "status tracking";
  if (estatus === "Resuelto") return "status solved";
  return "status";
}


function agregarClickReportes() {
  const rows = document.querySelectorAll("#reportes-table tbody .gridjs-tr");

  rows.forEach((row) => {
    row.style.cursor = "pointer";

    row.addEventListener("click", () => {
      const idReporte = row.children[0].textContent;
      const reporte = reportes.find((r) => r.id === idReporte);

      if (!reporte) return;

      reporteSeleccionado = reporte;

      document.getElementById("detail-id").textContent = reporte.id;
      document.getElementById("detail-date").textContent = reporte.fecha;
      document.getElementById("detail-description").textContent = reporte.descripcion;
      document.getElementById("detail-select").value = reporte.estatus;
      document.getElementById("detail-encargado").value = reporte.encargado
      document.getElementById("detail-encargado-texto").textContent =
      reporte.encargado || "Sin Asignar";
      const status = document.getElementById("detail-status");
      status.textContent = reporte.estatus;
      status.className = getStatusClass(reporte.estatus);

      document.querySelector(".file-item span").textContent = reporte.evidencia;
    });
  });
}