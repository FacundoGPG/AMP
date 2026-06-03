/* const historyData = window.historyData || [];


const datosHistorial = historyData.map((item) => [
  item.ID,
  item.Usuario,
  item.Actividad,
  item.Modulo,
  item.Fecha ? new Date(item.Fecha).toLocaleString("es-MX") : "",
  gridjs.html(`<span class="${statusBadge(item.Estado)}">${item.Estado || ""}</span>`),
]);

new gridjs.Grid({
  columns: [
    "ID",
    "Usuario",
    "Actividad",
    "Módulo",
    "Fecha",
    "Estado",
  ],
  data: datosHistorial,
  search: {
    placeholder: "Buscar actividad...",
  },
  sort: true,
  pagination: {
    limit: 5,
  },
}).render(document.getElementById("history-table"));
*/

const fechaActual = new Date().toLocaleString("es-MX");
const datosHistorial = [
    [
        1,
        "Administrador",
        "Inicio de sesión",
        "Usuarios",
        fechaActual,
        gridjs.html('<span class="badge bg-success">Activo</span>')
    ],
    [
        2,
        "Oficial de Cumplimiento",
        "Revisó reporte",
        "Buzón",
        fechaActual,
        gridjs.html('<span class="badge bg-primary">Revisado</span>')
    ],
    [
        3,
        "Empleado",
        "Subió evidencia",
        "Buzón",
        fechaActual,
        gridjs.html('<span class="badge bg-warning text-dark">Completado</span>')
    ],
    [
        4,
        "Cliente",
        "Subió documentos",
        "Clientes",
        fechaActual,
        gridjs.html('<span class="badge bg-secondary">Pendiente</span>')
    ],
    [
        5,
        "Administrador",
        "Consultó historial",
        "Historial",
        fechaActual,
        gridjs.html('<span class="badge bg-info text-dark">Consulta</span>')
    ]
];

new gridjs.Grid({
    columns: [
        "ID",
        "Usuario",
        "Actividad",
        "Módulo",
        "Fecha",
        "Estado"
    ],
    data: datosHistorial,
    search: {
        placeholder: "Buscar actividad..."
    },
    sort: true,
    pagination: {
        limit: 5
    }
}).render(
    document.getElementById("history-table")
);