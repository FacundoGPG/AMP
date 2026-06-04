let clientesCargados = [];
let clienteSeleccionado = null;


// Cargar Tablas
async function cargarTablaClientes() {
  const clientesContainer = document.getElementById("clientes-table");
  if (!clientesContainer) return;

  const response = await fetch("/api/clientes");
  clientesCargados = await response.json();
  actualizarResumenClientes(clientesCargados);

  new gridjs.Grid({
    columns: [
      "ID Cliente",
      "Nombre Completo",
      "Tipo Persona",
      "RFC",
      "Correo",
      "Teléfono",
      "Estatus",
      "Fecha Registro"
    ],
    data: clientesCargados.map(c => [
      c.id_cliente,
      c.nombre,
      c.tipo_persona,
      c.rfc,
      c.correo,
      c.telefono,
      c.estatus,
      formatearFecha(c.fecha_registro)
    ]),
    search: true,
    sort: true,
    pagination: { limit: 10 }
  }).render(clientesContainer);

  agregarClickClientes();
}
async function cargarTablaBloqueados() {
  const bloqueadosContainer = document.getElementById("bloqueados-table");
  if (!bloqueadosContainer) return;

  try {
    const response = await fetch("/api/clientes/bloqueados");
    const personasBloqueadas = await response.json();
    actualizarTotalBloqueados(personasBloqueadas.length);

    new gridjs.Grid({
      columns: ["Nombre / Razon Social", "RFC", "Tipo", "Motivo de Bloqueo", "Fecha de Bloqueo"],
      data: personasBloqueadas.map((b) => [
        b.nombre,
        b.rfc,
        b.tipo_persona,
        b.motivo_bloqueo || "Sin motivo registrado",
        formatearFecha(b.fecha_bloqueo)
      ]),
      search: true,
      sort: true,
      pagination: { limit: 5 }
    }).render(bloqueadosContainer);
  } catch (error) {
    console.error("Error cargando clientes bloqueados:", error);
    bloqueadosContainer.textContent = "No se pudieron cargar las personas bloqueadas.";
  }
}

// Dar formato fecha (Dia/mes/año)
function formatearFecha(fecha) {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-MX");
}

// Info para cards
function actualizarResumenClientes(clientes) {
  const totalClientes = document.getElementById("total-clientes");
  const totalActivos = document.getElementById("total-clientes-activos");
  const totalNuevos = document.getElementById("total-clientes-nuevos");
  const hace7Dias = new Date();

  hace7Dias.setDate(
    hace7Dias.getDate() - 7
  );
  if (totalClientes) {
    totalClientes.textContent = clientes.length;
  }

  if (totalActivos) {
    totalActivos.textContent = clientes.filter((c) => c.estatus === "Activo").length;
  }

  if (totalActivos) {
    totalNuevos.textContent = clientes.filter((c) => new Date(c.fecha_registro) >= hace7Dias).length
  }
}

function actualizarTotalBloqueados(total) {
  const totalBloqueados = document.getElementById("total-clientes-bloqueados");

  if (totalBloqueados) {
    totalBloqueados.textContent = total;
  }
}

function agregarClickClientes() {
  const tabla = document.getElementById("clientes-table");
  if (!tabla) return;

  tabla.addEventListener("click", (event) => {
    const row = event.target.closest("tbody .gridjs-tr");
    if (!row) return;

    const idCliente = Number(row.children[0].textContent);
    const cliente = clientesCargados.find((c) => c.id_cliente === idCliente);

    if (!cliente) return;

    clienteSeleccionado = cliente;
    mostrarDetalleCliente(cliente);
  });
}

function abrirClientePanel() {
  const overlay = document.getElementById("clienteOverlay");
  const panel = document.getElementById("clientePanel");

  if (!overlay || !panel ) return;

  overlay.classList.add("active");
  panel.classList.add("active");
}

function cerrarClientePanel() {
  const overlay = document.getElementById("clienteOverlay");
  const panel = document.getElementById("clientePanel");

  if (!overlay || !panel ) return;

  overlay.classList.remove("active");
  panel.classList.remove("active");
}

function iniciarTabsPanelCliente() {
  const tabs = document.querySelectorAll(".cliente-panel-tab");
  const sections = document.querySelectorAll(".cliente-panel-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.panelTab;

      tabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(targetId)?.classList.add("active");
    });
  });
}

function iniciarTabsClientes() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tableSections = document.querySelectorAll(".table-section");

  if (!tabBtns.length || !tableSections.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.table;

      tabBtns.forEach((b) => b.classList.remove("active"));
      tableSections.forEach((section) => section.classList.remove("active"));

      btn.classList.add("active");

      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add("active");
      }
    });
  });
}

function iniciarPanelCliente() {
  const overlay = document.getElementById("clienteOverlay");
  const cerrarBtn = document.getElementById("cerrarClientePanel");

  if (overlay) {
    overlay.addEventListener("click", cerrarClientePanel);
  }

  if (cerrarBtn) {
    cerrarBtn.addEventListener("click", cerrarClientePanel);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      cerrarClientePanel();
    }
  });
}

function mostrarDetalleCliente(c) {
  document.getElementById("cliente-detail-nombre").textContent = c.nombre;
  document.getElementById("cliente-detail-rfc").textContent = c.rfc;
  document.getElementById("cliente-detail-correo").textContent = c.correo;
  document.getElementById("cliente-detail-telefono").textContent = c.telefono;
  document.getElementById("cliente-detail-estatus").textContent = c.estatus;
  document.getElementById("cliente-detail-tipo").textContent = c.tipo_persona;
  document.getElementById("cliente-detail-domicilio").textContent = c.domicilio;
  document.getElementById("cliente-detail-fecha").textContent = formatearFecha(c.fecha_registro);
  abrirClientePanel();
}

function addCliente() {
  const addClientesBtn = document.getElementById("addClientes");
  const panelClientes = document.getElementById("addClientePanel");
  const overlay = document.getElementById("addClienteOverlay");
  const cerrarBtn = document.getElementById("cerrarAddClientePanel");
  const primerCampo = document.getElementById("nombre");

  if (!addClientesBtn || !panelClientes || !overlay) return;

  const abrirPanel = () => {
    panelClientes.classList.add("active");
    overlay.classList.add("active");
    primerCampo?.focus();
  };

  const cerrarPanel = () => {
    panelClientes.classList.remove("active");
    overlay.classList.remove("active");
  };

  addClientesBtn.addEventListener("click", abrirPanel);
  overlay.addEventListener("click", cerrarPanel);
  cerrarBtn?.addEventListener("click", cerrarPanel);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      cerrarPanel();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarTablaClientes();
  cargarTablaBloqueados();
  iniciarTabsClientes();
  iniciarPanelCliente();
  iniciarTabsPanelCliente();
  addCliente();
});
