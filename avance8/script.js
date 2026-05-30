
async function cargarComponentes() {
  try {
    // NAVBAR / TOPBAR
    const navRes = await fetch('/topbar.html');
    const navHtml = await navRes.text();
    document.getElementById('navbar-container').innerHTML = navHtml;

    // SIDEBAR
    const sideRes = await fetch('/sidebar.html');
    const sideHtml = await sideRes.text();
    document.getElementById('sidebar-container').innerHTML = sideHtml;

    // IMPORTANTE: iniciar después del fetch
    iniciarSidebar();

  } catch (error) {
    console.error('Error cargando componentes:', error);
  }
}

cargarComponentes();

function iniciarSidebar() {
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("close-btn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!menuBtn || !closeBtn || !sidebar || !overlay) {
    console.warn("No se encontraron elementos de la sidebar");
    return;
  }

  menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
}



const tableContainer = document.getElementById("operaciones-table");
const operaciones = [
  ["OP-001", "Ana López", "Crédito Personal", "Transferencia", "$25,000", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-002", "Empresa X", "Factoraje", "Depósito", "$150,000", "24/05/2024", "Exitosa", "Medio"],
  ["OP-003", "Juan Pérez", "Crédito Empresarial", "Retiro", "$8,500", "24/05/2024", "En revisión", "Alto"],
  ["OP-004", "Carlos Ruiz", "Crédito Personal", "Transferencia", "$12,000", "24/05/2024", "Sospechosa", "Alto"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
];
if (tableContainer) {
  new gridjs.Grid({
    columns: [
      "ID Operacion",
      "Cliente",
      "Producto",
      "Tipo",
      "Monto",
      "Fecha",
      "Estatus",
      "Riesgo"
    ],
    data: operaciones,
    search: false ,
    sort: true,
    pagination: {
      limit: 10
    }
  }).render(tableContainer);
}

document.addEventListener("DOMContentLoaded", () => {
const tableContainer = document.getElementById("alertas-table");
const alertas = [
  ["AL-0001", "2025-05-24 13:45", "Ana López", "Transacción inusual", "Transferencia por monto elevado detectada.", "Alta", "En revisión"],
  ["AL-0002", "2025-05-24 12:30", "Empresa X", "Patrón inusual", "Múltiples operaciones fraccionadas.", "Media", "Abierta"],
  ["AL-0003", "2025-05-24 11:15", "Juan Pérez", "Datos inconsistentes", "Diferencia en documentación.", "Alta", "En revisión"],
  ["AL-0004", "2025-05-24 10:05", "Carlos Ruiz", "Actividad sospechosa", "Cambio de dispositivo frecuente.", "Alta", "Abierta"],
  ["AL-0005", "2025-05-24 09:40", "María García", "Perfil de riesgo", "Coincidencia en listas restrictivas.", "Alta", "Cerrada"],
  ["AL-0006", "2025-05-24 09:10", "Distribuidora Z", "Uso inusual", "Operaciones fuera del patrón.", "Media", "En revisión"],
  ["AL-0007", "2025-05-24 08:55", "Pedro Martínez", "Transacción inusual", "Depósitos recurrentes.", "Media", "Abierta"],
  ["AL-0008", "2025-05-24 08:20", "Constructora AB", "Patrón inusual", "Pagos a múltiples beneficiarios.", "Baja", "Cerrada"],
  ["AL-0009", "2025-05-24 07:50", "Laura Sánchez", "Datos inconsistentes", "Datos fiscales incorrectos.", "Media", "Abierta"],
  ["AL-0010", "2025-05-24 07:15", "Servicios GHI", "Actividad sospechosa", "Descargas inusuales.", "Alta", "En revisión"],
  ["AL-0011", "2025-05-24 07:20", "Servicios 234", "Actividad sospechosa", "Descargas inusuales.", "Medio", "Cerrada"],
  ["AL-0011", "2025-05-24 07:20", "Servicios 123", "Actividad sospechosa", "Descargas inusuales.", "Alta", "Abierta"]
];

if (tableContainer) {
  new gridjs.Grid({
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

  
}})


const dropdownItems = document.querySelectorAll(".dropdown-item");
const dropdownBtn = document.getElementById("dropdownMenuLink");


document.addEventListener("DOMContentLoaded", () => {
  const clientesContainer = document.getElementById("clientes-table");

  const clientes = [
    ["CLI-0001", "Ana López Martínez", "LOMA890101ABC", "Persona Física", "Activo", "1", "12/01/2026"],
    ["CLI-0002", "Empresa X, S.A. de C.V.", "EXP120305KJ9", "Persona Moral", "Activo", "3", "08/02/2026"],
    ["CLI-0003", "Juan Pérez García", "PEGJ760515DEF", "Persona Física", "Activo", "2", "15/02/2026"],
    ["CLI-0004", "Comercializadora del Norte S.A.", "CNO900201LM2", "Persona Moral", "Bloqueado", "0", "20/03/2026"],
    ["CLI-0005", "María Teresa Ruiz Sánchez", "RUST850812G45", "Persona Física", "Activo", "1", "05/04/2026"],
    ["CLI-0006", "Distribuidora Zeta S.A. de C.V.", "DZE110403PL7", "Persona Moral", "Activo", "0", "18/04/2025"],
    ["CLI-0007", "Carlos Alberto Medina López", "MELC810909H12", "Persona Física", "Bloqueado", "0", "22/05/2026"],
    ["CLI-0008", "Servicios Integrales ABC S.A.", "SIA130619MN4", "Persona Moral", "Activo", "4", "11/06/2025"],
    ["CLI-0009", "Laura Sánchez", "SALA920714P90", "Persona Física", "Activo", "0", "25/06/2025"],
    ["CLI-0010", "Grupo Financiero Delta", "GFD150203A11", "Persona Moral", "Bloqueado", "2", "03/07/2025"],
    ["CLI-0011", "Pedro Martínez", "MAPE881010Q23", "Persona Física", "Activo", "0", "18/07/2025"],
    ["CLI-0012", "Servicios GHI", "SGH180401B22", "Persona Moral", "Activo", "1", "01/08/2025"]
  ];

  if (clientesContainer) {
    new gridjs.Grid({
      columns: [
        "ID Cliente",
        "Nombre / Razón Social",
        "RFC",
        "Tipo de Cliente",
        "Estatus",
        "Alertas Historicas",
        "Fecha de Registro"
      ],
      data: clientes,
      search: false,
      sort: true,
      pagination: {
        limit: 10
      }
    }).render(clientesContainer);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const bloqueadosContainer = document.getElementById("bloqueados-table");

  const personasBloqueadas = [
    ["PB-0001", "Carlos Alberto Medina López", "MELC810909H12", "Persona Física", "Coincidencia en lista de riesgo", "22/05/2025"],
    ["PB-0002", "Grupo Financiero Delta", "GFD150203A11", "Persona Moral", "Actividad sospechosa", "03/07/2025"],
    ["PB-0003", "Comercializadora del Norte S.A.", "CNO900201LM2", "Persona Moral", "Documentación inconsistente", "20/03/2026"]
  ];

  if (bloqueadosContainer) {
    new gridjs.Grid({
      columns: [
        "ID",
        "Nombre / Razón Social",
        "RFC",
        "Tipo",
        "Motivo de Bloqueo",
        "Fecha de Bloqueo"
      ],
      data: personasBloqueadas,
      search: false,
      sort: true,
      pagination: {
        limit: 5
      }
    }).render(bloqueadosContainer);
  }
});

const tabBtns = document.querySelectorAll(".tab-btn");
const tableSections = document.querySelectorAll(".table-section");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.table;

    tabBtns.forEach((b) => b.classList.remove("active"));
    tableSections.forEach((section) => section.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(targetId).classList.add("active");
  });
});

const btn = document.getElementById("dropdown-btn");
const menu = document.getElementById("dropdown-menu");

btn.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// cerrar si das click fuera
document.addEventListener("click", (e) => {
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("reportes-table");

  if (!container) {
    console.warn("No existe el contenedor reportes-table");
    return;
  }

  const reportes = [
    ["REP-24-0012", "22/05/2024 11:32", "Pendiente", "Operación inusual en cuenta CLI-000123"],
    ["REP-24-0011", "21/05/2024 09:15", "En seguimiento", "Posible estructura en múltiples transferencias"],
    ["REP-24-0010", "20/05/2024 16:45", "Resuelto", "Conducta sospechosa en retiros en efectivo"],
    ["REP-24-0009", "19/05/2024 14:20", "Pendiente", "Depósitos inusuales en efectivo"]
  ];

  new gridjs.Grid({
    columns: [
      "ID del reporte",
      "Fecha",
      {
        name: "Estatus",
        formatter: (cell) => {
          let clase = "status";

          if (cell === "Pendiente") clase += " pending";
          if (cell === "En seguimiento") clase += " tracking";
          if (cell === "Resuelto") clase += " solved";

          return gridjs.html(`<span class="${clase}">${cell}</span>`);
        }
      },
      "Descripción breve"
    ],
    data: reportes,
    search: false,
    sort: true,
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
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("reportes-table");

  if (!container) {
    console.warn("No existe el contenedor reportes-table");
    return;
  }

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
    },
    {
      id: "REP-24-0009",
      fecha: "19/05/2024 14:20",
      estatus: "Pendiente",
      descripcion: "Depósitos inusuales en efectivo.",
      evidencia: "Sin archivos"
    }
  ];

  new gridjs.Grid({
    columns: [
      "ID del reporte",
      "Fecha",
      {
        name: "Estatus",
        formatter: (cell) => {
          let clase = "status";

          if (cell === "Pendiente") clase += " pending";
          if (cell === "En seguimiento") clase += " tracking";
          if (cell === "Resuelto") clase += " solved";

          return gridjs.html(`<span class="${clase}">${cell}</span>`);
        }
      },
      "Descripción breve"
    ],
    data: reportes.map((r) => [
      r.id,
      r.fecha,
      r.estatus,
      r.descripcion
    ]),
    search: false,
    sort: true,
    pagination: {
      limit: 5
    }
  }).render(container);

  setTimeout(() => {
    const rows = document.querySelectorAll("#reportes-table .gridjs-tr");

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
        status.className = "status";

        if (reporte.estatus === "Pendiente") status.classList.add("pending");
        if (reporte.estatus === "En seguimiento") status.classList.add("tracking");
        if (reporte.estatus === "Resuelto") status.classList.add("solved");

        const fileItem = document.querySelector(".file-item span");
        fileItem.textContent = reporte.evidencia;
      });
    });
  }, 300);
});

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");

  if (tab === "bloqueados") {
    document.querySelector('[data-table="bloqueados-section"]').click();
  }
});