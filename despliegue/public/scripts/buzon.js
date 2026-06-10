let gridReportes;
let reporteSeleccionado = null;
let reportesCargados = [];
 
async function cargarTablaReportes() {
  const container = document.getElementById("reportes-table");
  if (!container) return;
 
  const response = await fetch("/api/buzon");
  reportesCargados = await response.json();
 
  actualizarContadores(reportesCargados);
 
  if (gridReportes) {
    gridReportes.updateConfig({ data: obtenerDataReportes() }).forceRender();
    setTimeout(agregarClickReportes, 300);
    return;
  }
 
  gridReportes = new gridjs.Grid({
    columns: [
      "ID del reporte",
      "Fecha",
      {
        name: "Estatus",
        formatter: (cell) =>
          gridjs.html(`<span class="${getStatusClass(cell)}">${cell}</span>`)
      },
      "Encargado"
    ],
    data: obtenerDataReportes(),
    search: false,
    sort: true,
    pagination: { limit: 5 }
  }).render(container);
 
  setTimeout(agregarClickReportes, 300);
}
 
async function cargarContadoresDesdeAPI() {
  try {
    const response = await fetch("/api/buzon/contadores");
    const contadores = await response.json();
 
    const total = document.getElementById("total-reportes");
    const pendientes = document.getElementById("pendientes");
    const enSeguimiento = document.getElementById("en-seguimiento");
    const resueltos = document.getElementById("resueltos");
 
    if (total) total.textContent = contadores.total;
    if (pendientes) pendientes.textContent = contadores.pendientes;
    if (enSeguimiento) enSeguimiento.textContent = contadores.en_seguimiento;
    if (resueltos) resueltos.textContent = contadores.resueltos;
  } catch (error) {
    console.error("Error cargando contadores: ", error);
  }
}
 
function actualizarContadores(reportes) {
  const total = document.getElementById("total-reportes");
  const pendientes = document.getElementById("pendientes");
  const enSeguimiento = document.getElementById("en-seguimiento");
  const resueltos = document.getElementById("resueltos");
 
  if (total) total.textContent = reportes.length;
  if (pendientes) pendientes.textContent = reportes.filter(r => r.estatus === "Pendiente").length;
  if (enSeguimiento) enSeguimiento.textContent = reportes.filter(r => r.estatus === "En seguimiento").length;
  if (resueltos) resueltos.textContent = reportes.filter(r => r.estatus === "Resuelto").length;
}
 
function obtenerDataReportes() {
  return reportesCargados.map(r => [
    r.id_alerta,
    r.fecha ? new Date(r.fecha).toLocaleString("es-MX") : "",
    r.estatus,
    r.encargado
  ]);
}
 
function agregarClickReportes() {
  const rows = document.querySelectorAll("#reportes-table tbody .gridjs-tr");
 
  rows.forEach((row) => {
    row.style.cursor = "pointer";
 
    row.addEventListener("click", () => {
      const idReporte = Number(row.children[0].textContent.trim());
      const reporte = reportesCargados.find(r => r.id_alerta === idReporte);
 
      if (!reporte) return;
 
      reporteSeleccionado = reporte;
 
      document.getElementById("detail-id").textContent = reporte.id_alerta;
      document.getElementById("detail-date").textContent = reporte.fecha ? new Date(reporte.fecha).toLocaleString("es-MX") : "";
      document.getElementById("detail-description").textContent = reporte.descripcion_reporte;
      document.getElementById("detail-select").value = reporte.estatus;
      document.getElementById("detail-encargado").value = reporte.id_encargado || "";
      document.getElementById("detail-encargado-texto").textContent = reporte.encargado || "Sin asignar";
 
      const status = document.getElementById("detail-status");
      if (status) {
        status.textContent = reporte.estatus;
        status.className = getStatusClass(reporte.estatus);
      }
 
      const fileSpan = document.getElementById("evidencia-nombre");
      const fileLink = document.getElementById("evidencia-link");
      console.log("fileSpan:", fileSpan);
      console.log("fileLink:", fileLink);

      if (fileSpan && fileLink) {
        if (reporte.ruta_evidencia) {
          fileSpan.textContent = reporte.ruta_evidencia.split("/").pop();
          fileLink.href = `/get_private_file/${reporte.ruta_evidencia.split("/").pop()}`;
          fileLink.style.display = "inline";
        } else {
          fileSpan.textContent = "Sin archivos";
          fileLink.style.display = "none";
        }
      }
 
      const notasEl = document.getElementById("detail-notas");
      if (notasEl) notasEl.value = reporte.notas || "";
    });
  });
}
 
function actualizarTablaReportes() {
  gridReportes.updateConfig({ data: obtenerDataReportes() }).forceRender();
  setTimeout(agregarClickReportes, 300);
}
 
function getStatusClass(estatus) {
  if (estatus === "Pendiente") return "status pending";
  if (estatus === "En seguimiento") return "status tracking";
  if (estatus === "Resuelto") return "status solved";
  return "status";
}
 

async function cargarUsuarios() {
  console.log("cargarUsuarios ejecutado");
  const select = document.getElementById("detail-encargado");
  if (!select) return;
 
  try {
    const response = await fetch("/api/buzon/usuarios");
    const data = await response.json();
    console.log("usuarios recibidos:", data);
 
    if (!response.ok || !Array.isArray(data)) {
      console.error("Error en respuesta:", data);
      return;
    }
 
    // Limpia opciones anteriores excepto "Sin asignar"
    while (select.options.length > 1) {
      select.remove(1);
    }
 
    data.forEach(u => {
      const option = document.createElement("option");
      option.value = u.id_usuario;
      option.textContent = u.nombre_completo;
      select.appendChild(option);
    });
 
    console.log("opciones después de cargar:", select.options.length);
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
}
 
function mostrarToast(mensaje = "Reporte actualizado correctamente", esError = false) {
  const toast = document.getElementById("toast-buzon");
  if (!toast) return;
 
  toast.textContent = mensaje;
  toast.style.background = esError ? "#ef4444" : "#22c55e";
  toast.style.display = "block";
  toast.style.opacity = "1";
 
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.style.display = "none", 300);
  }, 3000);
}
 

document.addEventListener("DOMContentLoaded", async () => {
  await cargarUsuarios();        
  await cargarTablaReportes();   
  cargarContadoresDesdeAPI();
 
  const selectStatus = document.getElementById("detail-select");
  const selectEncargado = document.getElementById("detail-encargado");
  const btnGuardar = document.getElementById("btn-guardar-nota");
 
  if (selectStatus) {
    selectStatus.addEventListener("change", () => {
      if (!reporteSeleccionado) return;
      reporteSeleccionado.estatus = selectStatus.value;
      const status = document.getElementById("detail-status");
      if (status) {
        status.textContent = selectStatus.value;
        status.className = getStatusClass(selectStatus.value);
      }
      actualizarTablaReportes();
    });
  }
 
  if (selectEncargado) {
    selectEncargado.addEventListener("change", () => {
      if (!reporteSeleccionado) return;
      reporteSeleccionado.id_encargado = selectEncargado.value || null;
      reporteSeleccionado.encargado = selectEncargado.options[selectEncargado.selectedIndex].textContent;
      actualizarTablaReportes();
    });
  }
 
  if (btnGuardar) {
    console.log("btnGuardar encontrado");
    btnGuardar.addEventListener("click", async () => {
      console.log("click en guardar");
      console.log("reporteSeleccionado:", reporteSeleccionado);
 
      if (!reporteSeleccionado) {
        console.log("No hay reporte seleccionado");
        return;
      }
 
      const estatus = document.getElementById("detail-select").value;
      const idEncargado = document.getElementById("detail-encargado").value || null;
      const notas = document.getElementById("detail-notas")?.value || "";
 
      try {
        const res = await fetch(`/api/buzon/${reporteSeleccionado.id_alerta}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estatus, idEncargado, notas })
        });
 
        if (res.ok) {
          mostrarToast("Reporte actualizado correctamente"); 
          await cargarTablaReportes();
          cargarContadoresDesdeAPI();
        } else {
          mostrarToast("Error al guardar el reporte", true);
        }
      } catch (error) {
        console.error("Error guardando nota:", error);
        mostrarToast("Error de conexión", true);
      }
    });
  } else {
    console.log("btnGuardar NO encontrado");
  }
});