let clientesCargados = [];
let clienteSeleccionado = null;
let clientesBloqueadosCargados = [];
let listasData = [];
let productosData = [];

if (typeof Dropzone !== "undefined") {
  Dropzone.autoDiscover = false;
}



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








// LISTAS DE CONFIGURACION


async function cargarListas() {
  const contenedor = document.getElementById("listas-table");
  if (!contenedor) return;

  try {
    const res    = await fetch("/api/listas");
    const listas = await res.json();

    new gridjs.Grid({
      columns: ["ID", "Tipo", "Nombre", "Fuente", "Acciones"],
      data: listas.map(l => [
        l.id_lista,
        l.tipo_lista,
        l.nombre,
        l.fuente,
        gridjs.html(`
          <button class="btn btn-sm btn-light btn-editar-lista" data-id="${l.id_lista}">Editar</button>
          <button class="btn btn-sm btn-danger btn-eliminar-lista" data-id="${l.id_lista}" data-nombre="${l.nombre}">Eliminar</button>
        `)
      ]),
      search: true,
      sort: true,
      pagination: { limit: 10 }
    }).render(contenedor);

    // Guardar listas para los botones
    listasData = listas;

    // Delegación de eventos
    contenedor.addEventListener("click", (e) => {
      const btnEditar   = e.target.closest(".btn-editar-lista");
      const btnEliminar = e.target.closest(".btn-eliminar-lista");

      if (btnEditar) {
        const lista = listasData.find(l => l.id_lista == btnEditar.dataset.id);
        if (lista) abrirModalEditarLista(lista);
      }

      if (btnEliminar) {
        eliminarLista(btnEliminar.dataset.id, btnEliminar.dataset.nombre);
      }
    });

  } catch {
    contenedor.innerHTML = "<p class='text-danger'>Error al cargar listas.</p>";
  }
}

function abrirModalAgregarLista() {
  document.getElementById("lista-modal-titulo").textContent = "Agregar lista";
  document.getElementById("lista-modal-id").value = "";
  document.getElementById("lista-modal-tipo").selectedIndex = 0;
  document.getElementById("lista-modal-nombre").value = "";
  document.getElementById("lista-modal-fuente").value = "";
  document.getElementById("lista-modal-error").style.display = "none";
  document.getElementById("lista-upload-titulo").textContent = "Cargar lista CSV";
  reiniciarListaCsvDropzone();
  abrirPanelLista();
}

function abrirModalEditarLista(lista) {
  document.getElementById("lista-modal-titulo").textContent = "Editar lista";
  document.getElementById("lista-modal-id").value = lista.id_lista;
  document.getElementById("lista-modal-tipo").value = lista.tipo_lista;
  document.getElementById("lista-modal-nombre").value = lista.nombre;
  document.getElementById("lista-modal-fuente").value = lista.fuente;
  document.getElementById("lista-modal-error").style.display = "none";
  document.getElementById("lista-upload-titulo").textContent = "¿Actualizar Lista?";
  reiniciarListaCsvDropzone();
  abrirPanelLista();
}

function abrirPanelLista() {
  document.getElementById("listaOverlay")?.classList.add("active");
  document.getElementById("listaPanel")?.classList.add("active");
  document.getElementById("lista-modal-nombre")?.focus();
}

function cerrarModalLista() {
  document.getElementById("listaOverlay")?.classList.remove("active");
  document.getElementById("listaPanel")?.classList.remove("active");
}

let listaCsvDropzone = null;

function iniciarListaCsvDropzone() {
  const dropzoneElement = document.getElementById("listaCsvDropzone");
  if (!dropzoneElement || typeof Dropzone === "undefined") return;

  Dropzone.autoDiscover = false;

  listaCsvDropzone = new Dropzone(dropzoneElement, {
    url: "/target",
    paramName: "file",
    autoProcessQueue: false,
    maxFiles: 1,
    maxFilesize: 10,
    acceptedFiles: ".csv,text/csv",
    addRemoveLinks: true,
    dictDefaultMessage: "Arrastra el CSV o haz clic para seleccionarlo",
    dictRemoveFile: "Eliminar archivo",
    dictInvalidFileType: "Solo se permiten archivos CSV",
    dictMaxFilesExceeded: "Solo puedes subir un archivo"
  });

  listaCsvDropzone.on("addedfile", async () => {
    const status = document.getElementById("lista-csv-status");
    if (status) status.textContent = "CSV cargado. Ejecutando validacion contra listas...";
    await validarClienteListas();
    if (status) status.textContent = "Validacion contra listas ejecutada.";
  });
}

function reiniciarListaCsvDropzone() {
  if (listaCsvDropzone) {
    listaCsvDropzone.removeAllFiles(true);
  }

  const status = document.getElementById("lista-csv-status");
  if (status) {
    status.textContent = "Sube un archivo CSV para volver a ejecutar la validacion contra listas.";
  }
}

async function guardarLista() {
  const id     = document.getElementById("lista-modal-id").value;
  const tipo   = document.getElementById("lista-modal-tipo").value;
  const nombre = document.getElementById("lista-modal-nombre").value.trim();
  const fuente = document.getElementById("lista-modal-fuente").value.trim();
  const errorEl = document.getElementById("lista-modal-error");

  if (!nombre || !fuente) {
    errorEl.textContent = "Nombre y fuente son obligatorios.";
    errorEl.style.display = "block";
    return;
  }

  const esEdicion = id !== "";
  const url    = esEdicion ? `/api/listas/${id}` : "/api/listas";
  const method = esEdicion ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo_lista: tipo, nombre, fuente })
    });

    if (!res.ok) {
      const data = await res.json();
      errorEl.textContent = data.error || "Error al guardar";
      errorEl.style.display = "block";
      return;
    }

    cerrarModalLista();
    document.getElementById("listas-table").innerHTML = "";
    cargarListas();
  } catch {
    errorEl.textContent = "Error de conexión";
    errorEl.style.display = "block";
  }
}

async function eliminarLista(id, nombre) {
  if (!confirm(`¿Eliminar la lista "${nombre}"?`)) return;

  try {
    const res = await fetch(`/api/listas/${id}`, { method: "DELETE" });
    if (res.ok) {
      document.getElementById("listas-table").innerHTML = "";
      cargarListas();
    } else {
      alert("Error al eliminar");
    }
  } catch {
    alert("Error de conexión");
  }
}



async function cargarRiesgoCliente(idCliente) {
  const listasEl   = document.getElementById("cliente-listas-list");
  const umbralesEl = document.getElementById("cliente-umbrales-list");

  if (listasEl)   listasEl.textContent   = "Cargando...";
  if (umbralesEl) umbralesEl.textContent = "Cargando...";

  // Validaciones contra listas
  try {
    const res  = await fetch(`/api/clientes/${idCliente}/validaciones`);
    const data = await res.json();

    if (!data.length) {
      listasEl.innerHTML = "<span class='text-muted'>Sin validaciones registradas.</span>";
    } else {
      listasEl.innerHTML = data.map(v => `
        <div class="riesgo-item ${v.coincidencia === 'Coincidencia' ? 'riesgo-alerta' : ''}">
          <strong>${v.tipo_lista} — ${v.nombre_lista}</strong>
          <span>${v.resultado} ${v.coincidencia === 'Coincidencia' ? '⚠️' : '✓'}</span>
          <small>${new Date(v.fecha_validacion).toLocaleDateString('es-MX')}</small>
        </div>
      `).join("");
    }
  } catch {
    if (listasEl) listasEl.innerHTML = "<span class='text-danger'>Error al cargar validaciones.</span>";
  }

  // Umbrales
  try {
    const res  = await fetch(`/api/clientes/${idCliente}/umbrales`);
    const data = await res.json();

    umbralesEl.innerHTML = data.map(u => `
      <div class="umbral-item">
        <div class="umbral-info">
          <strong>${u.tipo_alerta}</strong>
          <small>${u.descripcion}</small>
          <span class="umbral-nivel nivel-${u.nivel?.toLowerCase()}">${u.nivel}</span>
        </div>
        <label class="umbral-toggle">
          <input
            type="checkbox"
            class="toggle-umbral"
            data-id-umbral="${u.id_umbral}"
            data-id-cliente="${idCliente}"
            ${u.activo ? 'checked' : ''}
          >
          <span>${u.activo ? 'Activo' : 'Inactivo'}</span>
        </label>
      </div>
    `).join("");

    umbralesEl.querySelectorAll(".toggle-umbral").forEach(checkbox => {
      checkbox.addEventListener("change", async (e) => {
        const idUmbral  = e.target.dataset.idUmbral;
        const idCliente = e.target.dataset.idCliente;
        const activo    = e.target.checked;

        try {
          await fetch(`/api/clientes/${idCliente}/umbrales/${idUmbral}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo })
          });
          e.target.nextElementSibling.textContent = activo ? "Activo" : "Inactivo";
        } catch {
          alert("Error al actualizar umbral");
          e.target.checked = !activo;
        }
      });
    });

  } catch {
    if (umbralesEl) umbralesEl.innerHTML = "<span class='text-muted'>Sin umbrales configurados.</span>";
  }
}

async function validarClienteListas() {
  if (!clienteSeleccionado) {
    const status = document.getElementById("lista-csv-status");
    if (status) {
      status.textContent = "Selecciona un cliente antes de validar contra listas.";
    }
    return;
  }

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
  cargarListas();
  iniciarTabsClientes();
  iniciarPanelCliente();
  iniciarTabsPanelCliente();
  addCliente();
  iniciarExportacionClientes();

  document.getElementById("btn-nuevo-contrato")
    ?.addEventListener("click", abrirModalNuevoContrato);
  document.getElementById("btn-cancelar-contrato")
    ?.addEventListener("click", cerrarModalContrato);
  document.getElementById("btn-guardar-contrato")
    ?.addEventListener("click", guardarContrato);
  document.getElementById("btn-validar-listas")
    ?.addEventListener("click", validarClienteListas);

  document.getElementById("btn-agregar-lista")
    ?.addEventListener("click", abrirModalAgregarLista);
  document.getElementById("lista-modal-cerrar")
    ?.addEventListener("click", cerrarModalLista);
  document.getElementById("lista-modal-cancelar")
    ?.addEventListener("click", cerrarModalLista);
  document.getElementById("lista-form")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      guardarLista();
    });
  document.getElementById("listaOverlay")
    ?.addEventListener("click", cerrarModalLista);
  iniciarListaCsvDropzone();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModalLista();
  });
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
