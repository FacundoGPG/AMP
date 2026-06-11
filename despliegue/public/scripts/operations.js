let gridOperaciones;
let operacionesData = [];
let clientesOpData = [];


async function cargarClientesSelector() {
  try {
    const res = await fetch("/api/clientes");
    clientesOpData = await res.json();
    const select = document.getElementById("op-cliente");
    select.innerHTML = `<option value="">Selecciona un cliente...</option>` +
      clientesOpData.map(c => `<option value="${c.id_cliente}">${c.nombre}</option>`).join("");
  } catch {
    console.error("Error cargando clientes");
  }
}

async function cargarContratosSelector(idCliente) {
  const select = document.getElementById("op-contrato");
  select.disabled = true;
  select.innerHTML = `<option value="">Cargando...</option>`;

  try {
    const res = await fetch(`/api/clientes/${idCliente}/contratos`);
    const contratos = await res.json();

    if (!contratos.length) {
      select.innerHTML = `<option value="">Sin contratos activos</option>`;
      return;
    }

    select.innerHTML = contratos.map(c =>
      `<option value="${c.id_contrato}">${c.producto} — Saldo: $${Number(c.saldo).toLocaleString('es-MX')}</option>`
    ).join("");
    select.disabled = false;
  } catch {
    select.innerHTML = `<option value="">Error al cargar contratos</option>`;
  }
}

async function guardarOperacion() {
  const id_contrato   = document.getElementById("op-contrato").value;
  const tipo_operacion = document.getElementById("op-tipo").value;
  const monto         = document.getElementById("op-monto").value;
  const canal         = document.getElementById("op-canal").value;
  const fecha         = document.getElementById("op-fecha").value;
  const errorEl       = document.getElementById("op-error");

  if (!id_contrato || !tipo_operacion || !monto || !canal || !fecha) {
    errorEl.textContent = "Todos los campos son obligatorios.";
    errorEl.style.display = "block";
    return;
  }

  try {
    const res = await fetch("/api/operaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_contrato, tipo_operacion, monto, canal, fecha })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || "Error al guardar";
      errorEl.style.display = "block";
      return;
    }

    // Mostrar alertas generadas si las hay
    if (data.alertas?.length) {
      alert(`Operación guardada. Se generaron ${data.alertas.length} alerta(s) automática(s).`);
    }


    cerrarAddOperacionPanel();
    cargarTablaOperaciones();
  } catch {
    errorEl.textContent = "Error de conexión";
    errorEl.style.display = "block";
  }
}

function abrirAddOperacionPanel() {
  document.getElementById("addOperacionPanel").classList.add("active");
  document.getElementById("addOperacionOverlay").classList.add("active");
  cargarClientesSelector();
}

function cerrarAddOperacionPanel() {
  document.getElementById("addOperacionPanel").classList.remove("active");
  document.getElementById("addOperacionOverlay").classList.remove("active");
  document.getElementById("op-error").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  cargarTablaOperaciones();


  const applyBtn = document.getElementById("applyFiltersOp");
  const clearBtn = document.getElementById("clearFiltersOp");

  if (applyBtn) applyBtn.addEventListener("click", applyOperacionFilters);
  if (clearBtn) clearBtn.addEventListener("click", cleanOperacionFiltros);

  document.getElementById("btn-nueva-operacion")?.addEventListener("click", abrirAddOperacionPanel);
  document.getElementById("cerrarAddOperacionPanel")?.addEventListener("click", cerrarAddOperacionPanel);
  document.getElementById("addOperacionOverlay")?.addEventListener("click", cerrarAddOperacionPanel);
  document.getElementById("btn-guardar-operacion")?.addEventListener("click", guardarOperacion);
  document.getElementById("exportOperacionesCSV")?.addEventListener("click", exportarOperacionesCSV);
  document.getElementById("op-cliente")?.addEventListener("change", (e) => {
    if (e.target.value) cargarContratosSelector(e.target.value);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarAddOperacionPanel();
  });

});




async function cargarTablaOperaciones() {
  const operacionesContainer = document.getElementById("operaciones-table");
  if (!operacionesContainer) return;

  const response = await fetch("/api/operaciones");
  operacionesData = await response.json();

  const data = operacionesData.map(op => [
    op.ID_Operacion,
    op.Cliente,
    op.Producto,
    op.Tipo_Operacion,
    op.Monto,
    op.Fecha,
    op.Estado,
    op.Canal,
    op.Riesgo
  ]);

  if (gridOperaciones) {
    gridOperaciones.updateConfig({ data }).forceRender();
    return;
  }

gridOperaciones = new gridjs.Grid({
  columns: [
    "ID Operación",
    "Cliente", 
    "Producto",
    "Tipo",
    "Monto",
    {
      name: "Fecha",
      formatter: (cell) => cell ? new Date(cell).toLocaleString("es-MX") : ""
    },
    "Estatus",
    "Canal",
    "Riesgo"
  ],
  data,
  sort: true,
  pagination: { limit: 10 }
}).render(operacionesContainer);
 
}

function applyOperacionFilters() {
  const texto = document.getElementById("searchClientOp").value.toLowerCase().trim();
  const tipo = document.getElementById("filterTipoOp").value.trim();
  const producto = document.getElementById("filterProductoOp").value.trim();
  const riesgo = document.getElementById("filterRiesgoOp").value.trim();
  const canal = document.getElementById("filterCanalOp").value.trim();
  const estatus = document.getElementById("filterEstatusOp").value.trim();

  const dateFrom = document.getElementById("dateFromOp").value;
  const dateTo = document.getElementById("dateToOp").value;

  const filtradas = operacionesData.filter(op => {
    
    const coincideTexto =
      texto === "" ||
      String(op.ID_Operacion).toLowerCase().includes(texto) ||
      op.Cliente.toLowerCase().includes(texto);

    const coincideTipo = 
      tipo === "" || op.Tipo_Operacion === tipo;
    const coincideProducto = 
      producto === "" || op.Producto === producto;
    const coincideRiesgo = 
      riesgo === "" || op.Riesgo === riesgo;
    const coincideCanal = 
      canal === "" || op.Canal === canal;
    const coincideEstatus = 
      estatus === "" || op.Estado === estatus;


    const fechaOp = new Date(op.Fecha);
    const coincideFechaDesde = 
      !dateFrom || fechaOp >= new Date(dateFrom);
    const coincideFechaHasta = 
      !dateTo || fechaOp <= new Date(dateTo);

    return (
      coincideTexto &&
      coincideTipo &&
      coincideProducto &&
      coincideRiesgo &&
      coincideCanal &&
      coincideEstatus &&
      coincideFechaDesde &&
      coincideFechaHasta
    );
  });

  gridOperaciones.updateConfig({
    data: filtradas.map(op => [
      op.ID_Operacion,
      op.Cliente,
      op.Producto,
      op.Tipo_Operacion,
      op.Monto,
      op.Fecha ? new Date(op.Fecha).toLocaleString("es-MX") : "",
      op.Estado,
      op.Canal,
      op.Riesgo
    ])
  }).forceRender();
}

function exportarOperacionesCSV() {
  exportarCSV({
    nombreBase: "operaciones",
    delimiter: ",",
    fields: [
      { label: "ID Operacion", value: "ID_Operacion" },
      { label: "Cliente", value: "Cliente" },
      { label: "Producto", value: "Producto" },
      { label: "Tipo", value: "Tipo_Operacion" },
      { label: "Monto", value: "Monto" },
      { label: "Fecha", value: "Fecha" },
      { label: "Estatus", value: "Estado" },
      { label: "Canal", value: "Canal" },
      { label: "Riesgo", value: "Riesgo" }
    ],
    data: operacionesData
  });
}

function cleanOperacionFiltros() {
  document.getElementById("searchClientOp").value = "";
  document.getElementById("dateFromOp").value = "";
  document.getElementById("dateToOp").value = "";
  document.getElementById("filterTipoOp").value = "";
  document.getElementById("filterProductoOp").value = "";
  document.getElementById("filterRiesgoOp").value = "";
  document.getElementById("filterCanalOp").value = "";
  document.getElementById("filterEstatusOp").value = "";

  gridOperaciones.updateConfig({
    data: operacionesData.map(op => [
      op.ID_Operacion,
      op.Cliente,
      op.Producto,
      op.Tipo_Operacion,
      op.Monto,
      op.Fecha ? new Date(op.Fecha).toLocaleString("es-MX") : "",
      op.Estado,
      op.Canal,
      op.Riesgo
    ])
  }).forceRender();
}
