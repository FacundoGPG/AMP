document.addEventListener("DOMContentLoaded", () => {
  cargarTablaClientes();
  cargarTablaBloqueados();
  iniciarTabsClientes();
});

function cargarTablaClientes() {
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

  new gridjs.Grid({
    columns: ["ID Cliente", "Nombre / Razón Social", "RFC", "Tipo de Cliente", "Estatus", "Alertas Históricas", "Fecha de Registro"],
    data: clientes,
    search: false,
    sort: true,
    pagination: { limit: 10 }
  }).render(clientesContainer);
}

function cargarTablaBloqueados() {
  const bloqueadosContainer = document.getElementById("bloqueados-table");
  if (!bloqueadosContainer) return;

  const personasBloqueadas = [
    ["PB-0001", "Carlos Alberto Medina López", "MELC810909H12", "Persona Física", "Coincidencia en lista de riesgo", "22/05/2025"],
    ["PB-0002", "Grupo Financiero Delta", "GFD150203A11", "Persona Moral", "Actividad sospechosa", "03/07/2025"],
    ["PB-0003", "Comercializadora del Norte S.A.", "CNO900201LM2", "Persona Moral", "Documentación inconsistente", "20/03/2026"]
  ];

  new gridjs.Grid({
    columns: ["ID", "Nombre / Razón Social", "RFC", "Tipo", "Motivo de Bloqueo", "Fecha de Bloqueo"],
    data: personasBloqueadas,
    search: false,
    sort: true,
    pagination: { limit: 5 }
  }).render(bloqueadosContainer);
}

function iniciarTabsClientes() {
  const tabtns = document.querySelectorAll(".tab-btn");
  const tableSections = document.querySelectorAll(".table-section");

  if (!tabtns.length || !tableSections.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.table;

      tabtns.forEach((b) => b.classList.remove("active"));
      tableSections.forEach((section) => section.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(targetId).classList.add("active");
    });
  });

}