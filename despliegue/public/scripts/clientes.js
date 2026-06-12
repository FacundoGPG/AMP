let clientesCargados = [];
let clienteSeleccionado = null;
let clientesBloqueadosCargados = [];
let productosData = [];



async function cargarTablaClientes() {
  const clientesContainer = document.getElementById("clientes-table");
  if (!clientesContainer) return;

  try {
    const response = await fetch("/api/clientes");
    const data = await response.json();
    clientesCargados = data;
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
  } catch (error) {
    console.error("Error cargando clientes:", error);
    clientesContainer.textContent = "No se pudieron cargar los clientes.";
  }
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
  cargarContratosCliente(c.id_cliente);
  cargarOperacionesCliente(c.id_cliente);
  cargarAlertasCliente(c.id_cliente);
  cargarRiesgoCliente(c.id_cliente);
  cargarDocumentosCliente(c.id_cliente); 
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
        delimiter: ",",
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
      delimiter: ",",
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








async function validarClienteListas() {
  if (!clienteSeleccionado) return;

  const btn = document.getElementById("btn-validar-listas");
  btn.disabled = true;
  btn.textContent = "Validando...";

  try {
    const res = await fetch(`/api/clientes/${clienteSeleccionado.id_cliente}/validar-listas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();

    if (res.ok) {
      await cargarRiesgoCliente(clienteSeleccionado.id_cliente);
    } else {
      alert(data.error || "Error al validar");
    }
  } catch {
    alert("Error de conexión");
  } finally {
    btn.disabled = false;
    btn.textContent = "Validar ahora";
  }
}

async function cargarContratosCliente(idCliente) {
  const contenedor = document.getElementById("cliente-contratos-list");
  if (!contenedor) return;
  contenedor.textContent = "Cargando...";

  try {
    const res  = await fetch(`/api/clientes/${idCliente}/contratos`);
    const data = await res.json();

    if (!data.length) {
      contenedor.innerHTML = "<span class='text-muted'>Sin contratos registrados.</span>";
      return;
    }

    contenedor.innerHTML = data.map(co => `
      <div class="contrato-item">
        <div class="contrato-info">
          <strong>${co.producto}</strong>
          <span class="contrato-tipo">${co.tipo_producto}</span>
        </div>
        <div class="contrato-detalle">
          <span>Saldo: $${Number(co.saldo).toLocaleString('es-MX')}</span>
          <span>Inicio: ${formatearFecha(co.fecha_inicio)}</span>
          <span class="contrato-estatus estatus-${co.estatus?.toLowerCase()}">${co.estatus}</span>
        </div>
      </div>
    `).join("");
  } catch {
    contenedor.innerHTML = "<span class='text-danger'>Error al cargar contratos.</span>";
  }
}

async function abrirModalNuevoContrato() {
  if (!productosData.length) {
    try {
      const res = await fetch("/api/productos");
      productosData = await res.json();
    } catch {
      alert("Error al cargar productos");
      return;
    }
  }

  const select = document.getElementById("contrato-inline-producto");
  select.innerHTML = productosData.map(p =>
    `<option value="${p.id_producto}">${p.nombre} — ${p.tipo}</option>`
  ).join("");

  document.getElementById("contrato-inline-error").style.display = "none";
  document.getElementById("contrato-inline-fecha-inicio").value = "";
  document.getElementById("contrato-inline-fecha-fin").value = "";
  document.getElementById("contrato-inline-saldo").value = "";
  document.getElementById("contrato-form-inline").style.display = "block";
  document.getElementById("btn-nuevo-contrato").style.display = "none";
}

function cerrarModalContrato() {
  document.getElementById("contrato-form-inline").style.display = "none";
  document.getElementById("btn-nuevo-contrato").style.display = "inline-block";
}

async function guardarContrato() {
  const idProducto  = document.getElementById("contrato-inline-producto").value;
  const fechaInicio = document.getElementById("contrato-inline-fecha-inicio").value;
  const fechaFin    = document.getElementById("contrato-inline-fecha-fin").value;
  const saldo       = document.getElementById("contrato-inline-saldo").value;
  const errorEl     = document.getElementById("contrato-inline-error");

  if (!idProducto || !fechaInicio || !saldo) {
    errorEl.textContent = "Producto, fecha de inicio y saldo son obligatorios.";
    errorEl.style.display = "block";
    return;
  }

  try {
    const res = await fetch(`/api/clientes/${clienteSeleccionado.id_cliente}/contratos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_producto: idProducto, fecha_inicio: fechaInicio, fecha_fin: fechaFin, saldo })
    });

    if (!res.ok) {
      const data = await res.json();
      errorEl.textContent = data.error || "Error al guardar";
      errorEl.style.display = "block";
      return;
    }

    cerrarModalContrato();
    cargarContratosCliente(clienteSeleccionado.id_cliente);
  } catch {
    errorEl.textContent = "Error de conexión";
    errorEl.style.display = "block";
  }
}

async function cargarOperacionesCliente(idCliente) {
  const contenedor = document.getElementById("cliente-operaciones-list");
  if (!contenedor) return;
  contenedor.textContent = "Cargando...";

  try {
    const res  = await fetch(`/api/clientes/${idCliente}/operaciones`);
    const data = await res.json();

    if (!data.length) {
      contenedor.innerHTML = "<span class='text-muted'>Sin operaciones registradas.</span>";
      return;
    }

    contenedor.innerHTML = data.map(o => {
      const producto = o.producto || o.Producto || "Sin producto";
      const tipo = o.tipo_operacion || o.Tipo_Operacion || "Sin tipo";
      const estado = o.estado || o.Estado || "Sin estatus";
      const canal = o.canal || o.Canal || "";
      const monto = o.monto || o.Monto || 0;
      const fecha = o.fecha || o.Fecha;
      const totalAlertas = o.total_alertas || o.totalAlertas || 0;
      const totalCasos = o.total_casos || o.totalCasos || 0;

      return `
        <div class="operacion-item">
          <div class="operacion-info">
            <strong>${tipo}</strong>
            <span class="operacion-producto">${producto}</span>
          </div>
          <div class="operacion-detalle">
            <span>$${Number(monto).toLocaleString('es-MX')}</span>
            <span>${formatearFechaHora(fecha)}</span>
            <span class="operacion-estado estado-${estado?.toLowerCase()}">${estado}</span>
            <span class="operacion-canal">${canal}</span>
            <span>Alertas: ${totalAlertas}</span>
            <span>Casos: ${totalCasos}</span>
          </div>
        </div>
      `;
    }).join("");
  } catch {
    contenedor.innerHTML = "<span class='text-danger'>Error al cargar operaciones.</span>";
  }
}

async function cargarAlertasCliente(idCliente) {
  const contenedor = document.getElementById("cliente-alertas-list");
  if (!contenedor) return;
  contenedor.textContent = "Cargando...";

  try {
    const res  = await fetch(`/api/clientes/${idCliente}/alertas`);
    const data = await res.json();

    if (!data.length) {
      contenedor.innerHTML = "<span class='text-muted'>Sin alertas registradas.</span>";
      return;
    }

    contenedor.innerHTML = data.map(a => `
      <div class="alerta-item prioridad-${a.prioridad?.toLowerCase()}">
        <div class="alerta-info">
          <strong>${a.tipo_alerta}</strong>
          <span>${a.motivo}</span>
        </div>
        <div class="alerta-detalle">
          <span class="alerta-prioridad">${a.prioridad || 'Sin prioridad'}</span>
          <span class="alerta-estatus">${a.estatus}</span>
          <small>${formatearFecha(a.fecha_generacion)}</small>
        </div>
      </div>
    `).join("");
  } catch {
    contenedor.innerHTML = "<span class='text-danger'>Error al cargar alertas.</span>";
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
  cargarDocumentosPendientes();

  document.getElementById("btn-nuevo-contrato")
    ?.addEventListener("click", abrirModalNuevoContrato);
  document.getElementById("btn-cancelar-contrato")
    ?.addEventListener("click", cerrarModalContrato);
  document.getElementById("btn-guardar-contrato")
    ?.addEventListener("click", guardarContrato);
  document.getElementById("btn-validar-listas")
    ?.addEventListener("click", validarClienteListas);

  document.getElementById("valdoc-modal-cerrar")
    ?.addEventListener("click", cerrarModalValidarDocumento);
  document.getElementById("valdoc-modal-cancelar")
    ?.addEventListener("click", cerrarModalValidarDocumento);
  document.getElementById("valdoc-modal-validar")
    ?.addEventListener("click", validarDocumentoYCrearCliente);
  document.getElementById("valdoc-modal-rechazar")
    ?.addEventListener("click", rechazarDocumento);
});


// DOCUMENTOS

window.validarDocumento = async (idDocumento, estatus) => {
  try {
    await fetch(`/api/clientes/documentos/${idDocumento}/validar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estatus })
    });
    if (clienteSeleccionado) {
      await cargarDocumentosCliente(clienteSeleccionado.id_cliente);  
    }
  } catch (error) {
    console.error("Error validando documento:", error);
  }
};

async function cargarDocumentosCliente(idCliente) {
  const contenedor = document.getElementById("cliente-documentos-list");
  if (!contenedor) return;
  contenedor.textContent = "Cargando...";

  try {
    const res  = await fetch(`/api/clientes/${idCliente}/documentos`);
    const data = await res.json();

    if (!data.length) {
      contenedor.innerHTML = "<span class='text-muted'>Sin documentos recibidos.</span>";
      return;
    }

    contenedor.innerHTML = data.map(d => `
      <div class="preview-item">
        <strong>${d.tipo_documento}</strong>
        <br><small>Archivo: ${d.nombre_archivo || "—"}</small>
        <br><small>Recibido: ${new Date(d.fecha_carga).toLocaleDateString("es-MX")}</small>
        <br><small>Estatus: <strong>${d.estatus_validacion || "Pendiente"}</strong></small>
        ${d.fecha_validacion ? `<br><small>Validado: ${new Date(d.fecha_validacion).toLocaleDateString("es-MX")}</small>` : ""}
        <br>
        <div style="display:flex; gap:0.5rem; margin-top:0.4rem;">
          <a href="${d.ruta_archivo}" target="_blank" class="btn btn-sm btn-light">Descargar</a>
          <button class="btn btn-sm btn-success" onclick="validarDocumento(${d.id_documento}, 'Validado')">Validar</button>
          <button class="btn btn-sm btn-danger"  onclick="validarDocumento(${d.id_documento}, 'Rechazado')">Rechazar</button>
        </div>
      </div>
    `).join("");
  } catch {
    contenedor.innerHTML = "<span class='text-danger'>Error al cargar documentos.</span>";
  }
}

async function cargarDocumentosPendientes() {
  const contenedor = document.getElementById("documentos-table");
  if (!contenedor) return;

  try {
    const res  = await fetch("/api/documentos/pendientes");
    const data = await res.json();

    if (!data.length) {
      contenedor.innerHTML = "<p class='text-muted'>No hay documentos pendientes de validación.</p>";
      return;
    }

    new gridjs.Grid({
      columns: [
        "ID",
        "Usuario",
        "Correo",
        "Archivo",
        "Fecha",
        "Estatus",
        "Acciones"
      ],
      data: data.map(d => [
        d.id_documento,
        d.nombre_usuario,
        d.correo,
        d.nombre_archivo,
        formatearFecha(d.fecha_carga),
        d.estatus_validacion,
        gridjs.html(`
          <button class="btn btn-sm btn-primary btn-revisar-doc" data-id="${d.id_documento}" data-datos='${JSON.stringify(d.datos_cliente).replace(/'/g, "&#39;")}' data-nombre="${d.nombre_usuario}">
            Revisar
          </button>
        `)
      ]),
      search: true,
      sort: true,
      pagination: { limit: 10 }
    }).render(contenedor);

    contenedor.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-revisar-doc");
      if (!btn) return;
      const id = btn.dataset.id;
      const nombre = btn.dataset.nombre;
      const datos = JSON.parse(btn.dataset.datos || "{}");
      abrirModalValidarDocumento(id, nombre, datos);
    });

  } catch (err) {
    console.error(err);
    contenedor.innerHTML = "<p class='text-danger'>Error al cargar documentos pendientes.</p>";
  }
}

function abrirModalValidarDocumento(idDocumento, nombreUsuario, datos) {
  document.getElementById("valdoc-id").value = idDocumento;
  document.getElementById("valdoc-nombre").value = datos.nombre || nombreUsuario;
  document.getElementById("valdoc-tipo").value = datos.tipo_persona || "";
  document.getElementById("valdoc-rfc").value = datos.rfc || "";
  document.getElementById("valdoc-correo").value = datos.correo || "";
  document.getElementById("valdoc-telefono").value = datos.telefono || "";
  document.getElementById("valdoc-domicilio").value = datos.domicilio || "";
  document.getElementById("valdoc-error").style.display = "none";
  document.getElementById("modal-validar-doc").style.display = "flex";
}

function cerrarModalValidarDocumento() {
  document.getElementById("modal-validar-doc").style.display = "none";
}

async function validarDocumentoYCrearCliente() {
  const id       = document.getElementById("valdoc-id").value;
  const errorEl  = document.getElementById("valdoc-error");

  const datos = {
    nombre:      document.getElementById("valdoc-nombre").value.trim(),
    tipo_persona: document.getElementById("valdoc-tipo").value,
    rfc:         document.getElementById("valdoc-rfc").value.trim(),
    correo:      document.getElementById("valdoc-correo").value.trim(),
    telefono:    document.getElementById("valdoc-telefono").value.trim(),
    domicilio:   document.getElementById("valdoc-domicilio").value.trim()
  };

  if (!datos.nombre || !datos.rfc || !datos.correo || !datos.telefono || !datos.domicilio || !datos.tipo_persona) {
    errorEl.textContent = "Todos los campos son obligatorios antes de validar.";
    errorEl.style.display = "block";
    return;
  }

  try {
    const res = await fetch(`/api/documentos/${id}/validar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (!res.ok) {
      const data = await res.json();
      errorEl.textContent = data.error || "Error al validar";
      errorEl.style.display = "block";
      return;
    }

    cerrarModalValidarDocumento();
    document.getElementById("documentos-table").innerHTML = "";
    cargarDocumentosPendientes();
  } catch {
    errorEl.textContent = "Error de conexión";
    errorEl.style.display = "block";
  }
}

async function rechazarDocumento() {
  const id = document.getElementById("valdoc-id").value;
  if (!confirm("¿Rechazar este documento? El usuario podrá volver a subir uno nuevo.")) return;

  try {
    const res = await fetch(`/api/documentos/${id}/rechazar`, { method: "POST" });
    if (res.ok) {
      cerrarModalValidarDocumento();
      document.getElementById("documentos-table").innerHTML = "";
      cargarDocumentosPendientes();
    }
  } catch {
    alert("Error de conexión");
  }
}
