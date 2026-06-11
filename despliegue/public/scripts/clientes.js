let clientesCargados = [];
let clienteSeleccionado = null;
let clientesBloqueadosCargados = [];



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
    clientesBloqueadosCargados = personasBloqueadas;
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

    agregarClickBloqueados();
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

function formatearFechaHora(fecha) {
  if (!fecha) return "---";
  return new Date(fecha).toLocaleString("es-MX");
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

function agregarClickBloqueados() {
  const tabla = document.getElementById("bloqueados-table");
  if (!tabla) return;

  tabla.addEventListener("click", async (event) => {
    const row = event.target.closest("tbody .gridjs-tr");
    if (!row) return;

    const rfc = row.children[1]?.textContent.trim();
    if (!rfc) return;

    if (!clientesCargados.length) {
      const response = await fetch("/api/clientes");
      clientesCargados = await response.json();
      actualizarResumenClientes(clientesCargados);
    }

    const clienteBloqueado = clientesBloqueadosCargados.find((c) => c.rfc === rfc);
    const clienteCompleto = clientesCargados.find((c) =>
      c.id_cliente === clienteBloqueado?.id_cliente || c.rfc === rfc
    );
    const cliente = clienteCompleto || clienteBloqueado;

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
  const estadoSelect = document.getElementById("estado-cliente-select");
  const estadoForm = document.getElementById("clienteEstadoForm");

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

  if (estadoSelect) {
    estadoSelect.addEventListener("change", actualizarCamposBloqueoCliente);
  }

  if (estadoForm) {
    estadoForm.addEventListener("submit", (event) => {
      const motivo = document.getElementById("estado-cliente-motivo");

      if (estadoSelect?.value === "Bloqueado" && !motivo?.value.trim()) {
        event.preventDefault();
        motivo?.focus();
      }
    });
  }
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
  cargarOperacionesPerCliente(c.id_cliente);
  llenarFormularioEstadoCliente(c);
  abrirClientePanel();
}

function llenarFormularioEstadoCliente(c) {
  const form = document.getElementById("clienteEstadoForm");
  const campos = {
    "estado-cliente-nombre": c.nombre,
    "estado-cliente-tipo": c.tipo_persona,
    "estado-cliente-rfc": c.rfc,
    "estado-cliente-domicilio": c.domicilio,
    "estado-cliente-correo": c.correo,
    "estado-cliente-telefono": c.telefono,
    "estado-cliente-fecha-bloqueo": c.fecha_bloqueo ? c.fecha_bloqueo.slice(0, 10) : "",
    "estado-cliente-select": c.estatus || "Activo",
    "estado-cliente-motivo": c.motivo_bloqueo || ""
  };

  if (form) {
    form.action = `/clientes/editar/${c.id_cliente}`;
  }

  Object.entries(campos).forEach(([id, valor]) => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.value = valor;
    }
  });

  actualizarCamposBloqueoCliente();
}

function actualizarCamposBloqueoCliente() {
  const estadoSelect = document.getElementById("estado-cliente-select");
  const motivoWrap = document.getElementById("estado-cliente-motivo-wrap");
  const motivo = document.getElementById("estado-cliente-motivo");
  const fechaBloqueo = document.getElementById("estado-cliente-fecha-bloqueo");
  const bloqueado = estadoSelect?.value === "Bloqueado";

  if (motivoWrap) {
    motivoWrap.hidden = !bloqueado;
  }

  if (motivo) {
    motivo.required = bloqueado;
    if (!bloqueado) {
      motivo.value = "";
    }
  }

  if (fechaBloqueo) {
    fechaBloqueo.value = bloqueado
      ? fechaBloqueo.value || new Date().toISOString().slice(0, 10)
      : "";
  }
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

function iniciarExportacionClientes() {
  const exportBtn = document.getElementById("exportClientesCSV");
  if (!exportBtn) return;

  exportBtn.addEventListener("click", () => {
    const bloqueadosActiva = document.getElementById("bloqueados-section")?.classList.contains("active");

    if (bloqueadosActiva) {
      exportarCSV({
        nombreBase: "clientes_bloqueados",
        delimiter: ";",
        fields: [
          { label: "Nombre / Razon Social", value: "nombre" },
          { label: "RFC", value: "rfc" },
          { label: "Tipo", value: "tipo_persona" },
          { label: "Motivo de Bloqueo", value: (c) => c.motivo_bloqueo || "Sin motivo registrado" },
          { label: "Fecha de Bloqueo", value: "fecha_bloqueo" }
        ],
        data: clientesBloqueadosCargados
      });
      return;
    }

    exportarCSV({
      nombreBase: "clientes",
      delimiter: ";",
      fields: [
        { label: "ID Cliente", value: "id_cliente" },
        { label: "Nombre Completo", value: "nombre" },
        { label: "Tipo Persona", value: "tipo_persona" },
        { label: "RFC", value: "rfc" },
        { label: "Correo", value: "correo" },
        { label: "Telefono", value: "telefono" },
        { label: "Estatus", value: "estatus" },
        { label: "Fecha Registro", value: "fecha_registro" }
      ],
      data: clientesCargados
    });
  });
}

async function cargarOperacionesPerCliente(idCliente = clienteSeleccionado?.id_cliente) {
  const contenedor = document.getElementById("cliente-operaciones-list");
  if (!contenedor) return;

  if (!idCliente) {
    contenedor.textContent = "Selecciona un cliente para ver sus operaciones.";
    return;
  }

  contenedor.textContent = "Cargando operaciones...";

  try {
    const response = await fetch(`/api/clientes/${idCliente}/operaciones`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar las operaciones del cliente.");
    }

    const operaciones = await response.json();

    if (!operaciones.length) {
      contenedor.textContent = "Este cliente no tiene operaciones registradas.";
      return;
    }

    contenedor.innerHTML = operaciones.map((op) => {
      const producto = op.producto || op.Producto || "Sin producto";
      const tipo = op.tipo_operacion || op.Tipo_Operacion || "Sin tipo";
      const estado = op.estado || op.Estado || "Sin estatus";
      const canal = op.canal || op.Canal || "Sin canal";
      const monto = op.monto || op.Monto || 0;
      const totalAlertas = op.total_alertas || op.totalAlertas || 0;
      const totalCasos = op.total_casos || op.totalCasos || 0;

      return `
        <article class="cliente-preview-item">
          <div>
            <strong>Operacion #${op.id_operacion || op.ID_Operacion}</strong>
            <span>${producto}</span>
          </div>
          <p>${tipo} · $${Number(monto).toLocaleString("es-MX")} · ${estado}</p>
          <p>${canal} · ${formatearFechaHora(op.fecha || op.Fecha)}</p>
          <p>Alertas: ${totalAlertas} · Casos: ${totalCasos}</p>
        </article>
      `;
    }).join("");
  } catch (error) {
    console.error("Error cargando operaciones del cliente:", error);
    contenedor.textContent = "No se pudieron cargar las operaciones del cliente.";
  }
}
  
document.addEventListener("DOMContentLoaded", () => {
  cargarTablaClientes();
  cargarTablaBloqueados();
  iniciarTabsClientes();
  iniciarPanelCliente();
  iniciarTabsPanelCliente();
  addCliente();
  iniciarExportacionClientes();
});
