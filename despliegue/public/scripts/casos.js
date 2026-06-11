let gridCasos;
let casosCargados = [];
let casoSeleccionado = null;

async function cargarCasos() {
  const container = document.getElementById("casos-table");
  if (!container) return;

  try {
    const response = await fetch("/api/casos");
    casosCargados = await response.json();
  } catch (error) {
    console.error("Error cargando casos:", error);
    casosCargados = [];
  }

  actualizarContadores();

  if (gridCasos) {
    gridCasos.updateConfig({ data: obtenerDataCasos() }).forceRender();
    setTimeout(agregarClickCasos, 300);
    return;
  }

  gridCasos = new gridjs.Grid({
    columns: ["ID", "Descripción", "Estatus", "Fecha apertura", "Alertas", "Analistas"],
    data: obtenerDataCasos(),
    sort: true,
    pagination: { limit: 10 }
  }).render(container);

  setTimeout(agregarClickCasos, 300);
}

function obtenerDataCasos() {
  return casosCargados.map(c => [
    c.id_caso,
    c.descripcion,
    c.estatus,
    c.fecha_apertura ? new Date(c.fecha_apertura).toLocaleDateString("es-MX") : "",
    c.total_alertas || 0,
    c.analistas || "Sin asignar"
  ]);
}

function actualizarContadores() {
  const total = document.getElementById("total-casos");
  const abiertos = document.getElementById("casos-abiertos");
  const enProceso = document.getElementById("casos-en-proceso");
  const cerrados = document.getElementById("casos-cerrados");

  if (total) total.textContent = casosCargados.length;
  if (abiertos) abiertos.textContent = casosCargados.filter(c => c.estatus === "Abierto").length;
  if (enProceso) enProceso.textContent = casosCargados.filter(c => c.estatus === "En_Proceso").length;
  if (cerrados) cerrados.textContent = casosCargados.filter(c => c.estatus === "Cerrado").length;
}

function agregarClickCasos() {
  const rows = document.querySelectorAll("#casos-table tbody .gridjs-tr");

  rows.forEach(row => {
    row.style.cursor = "pointer";
    row.addEventListener("click", async () => {
      const idCaso = Number(row.children[0].textContent.trim());
      await abrirPanelCaso(idCaso);
    });
  });
}

async function abrirPanelCaso(idCaso) {
  try {
    const response = await fetch(`/api/casos/${idCaso}`);
    const caso = await response.json();
    casoSeleccionado = caso;

    document.getElementById("caso-detail-id").textContent = `Caso #${caso.id_caso}`;
    document.getElementById("caso-detail-estatus").textContent = caso.estatus;
    document.getElementById("caso-detail-descripcion").textContent = caso.descripcion;
    document.getElementById("caso-detail-fecha-apertura").textContent =
      caso.fecha_apertura ? new Date(caso.fecha_apertura).toLocaleString("es-MX") : "---";
    document.getElementById("caso-detail-fecha-cierre").textContent =
      caso.fecha_cierre ? new Date(caso.fecha_cierre).toLocaleString("es-MX") : "Abierto";
    document.getElementById("caso-select-estatus").value = caso.estatus;

    // Alertas vinculadas
    const alertasList = document.getElementById("caso-alertas-list");
    if (caso.alertas && caso.alertas.length > 0) {
      alertasList.innerHTML = caso.alertas.map(a => `
        <div class="preview-item">
          <strong>Alerta #${a.id_alerta}</strong> — ${a.tipo_alerta}
          <br><small>${a.motivo}</small>
          <br><small>Prioridad: ${a.prioridad || "—"} | Estatus: ${a.estatus}</small>
        </div>
      `).join("");
    } else {
      alertasList.innerHTML = "<small>Sin alertas vinculadas.</small>";
    }

    // Analistas
    const analistasList = document.getElementById("caso-analistas-list");
    if (caso.analistas && caso.analistas.length > 0) {
      analistasList.innerHTML = caso.analistas.map(a => `
        <div class="preview-item">
          <strong>${a.nombre}</strong>
          <br><small>Asignado: ${new Date(a.fecha_asignacion).toLocaleDateString("es-MX")}</small>
          <br><small>Estatus: ${a.estatus_atencion}</small>
        </div>
      `).join("");
    } else {
      analistasList.innerHTML = "<small>Sin analistas asignados.</small>";
    }

    // Seguimiento
    const seguimientoList = document.getElementById("caso-seguimiento-list");
    const comentarios = caso.analistas ? caso.analistas.filter(a => a.comentario) : [];
    if (comentarios.length > 0) {
      seguimientoList.innerHTML = comentarios.map(c => `
        <div class="preview-item">
          <strong>${c.nombre}</strong> — <small>${new Date(c.fecha_asignacion).toLocaleString("es-MX")}</small>
          <br>${c.comentario}
        </div>
      `).join("");
    } else {
      seguimientoList.innerHTML = "<small>Sin intervenciones registradas.</small>";
    }

    abrirPanel("casoPanel", "casoOverlay");
  } catch (error) {
    console.error("Error abriendo caso:", error);
  }
}

function abrirPanel(panelId, overlayId) {
  const panel = document.getElementById(panelId);
  const overlay = document.getElementById(overlayId);
  if (panel) panel.classList.add("active");
  if (overlay) overlay.classList.add("active");
}

function cerrarPanel(panelId, overlayId) {
  const panel = document.getElementById(panelId);
  const overlay = document.getElementById(overlayId);
  if (panel) panel.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", async () => {
  // Leer params de URL al inicio
  const params = new URLSearchParams(window.location.search);
  const idAlertaParam = params.get("idAlerta");
  const motivoParam = params.get("motivo");

  await cargarCasos();

  // Cerrar panel detalle
  document.getElementById("cerrarCasoPanel")?.addEventListener("click", () => {
    cerrarPanel("casoPanel", "casoOverlay");
  });

  // Tabs del panel
  document.querySelectorAll(".cliente-panel-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.panelTab;
      document.querySelectorAll(".cliente-panel-tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".cliente-panel-section").forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });

  // Guardar estatus
  document.getElementById("btn-guardar-estatus")?.addEventListener("click", async () => {
    if (!casoSeleccionado) return;
    const estatus = document.getElementById("caso-select-estatus").value;
    try {
      await fetch(`/api/casos/${casoSeleccionado.id_caso}/estatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estatus })
      });
      casoSeleccionado.estatus = estatus;
      document.getElementById("caso-detail-estatus").textContent = estatus;
      await cargarCasos();
    } catch (error) {
      console.error("Error actualizando estatus:", error);
    }
  });

  // Agregar comentario
  document.getElementById("btn-agregar-comentario")?.addEventListener("click", async () => {
    if (!casoSeleccionado) return;
    const comentario = document.getElementById("caso-comentario").value.trim();
    if (!comentario) return;
    try {
      await fetch(`/api/casos/${casoSeleccionado.id_caso}/comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario })
      });
      document.getElementById("caso-comentario").value = "";
      await abrirPanelCaso(casoSeleccionado.id_caso);
    } catch (error) {
      console.error("Error agregando comentario:", error);
    }
  });

  // Vincular alerta desde tab Alertas
  document.getElementById("btn-vincular-alerta")?.addEventListener("click", async () => {
    if (!casoSeleccionado) return;
    const idAlerta = document.getElementById("caso-nueva-alerta-id").value.trim();
    const errorEl = document.getElementById("caso-vincular-error");

    if (!idAlerta) {
      errorEl.textContent = "Ingresa un ID de alerta.";
      errorEl.style.display = "block";
      return;
    }

    try {
      const res = await fetch(`/api/casos/${casoSeleccionado.id_caso}/alerta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idAlerta: Number(idAlerta) })
      });

      if (res.ok) {
        document.getElementById("caso-nueva-alerta-id").value = "";
        errorEl.style.display = "none";
        await abrirPanelCaso(casoSeleccionado.id_caso);
      } else {
        errorEl.textContent = "Error al vincular alerta.";
        errorEl.style.display = "block";
      }
    } catch (error) {
      console.error("Error vinculando alerta:", error);
    }
  });

  // Abrir panel crear caso
  document.getElementById("btn-nuevo-caso")?.addEventListener("click", () => {
    document.getElementById("crear-caso-id-alerta").value = "";
    document.getElementById("crear-caso-alerta-preview").style.display = "none";
    document.getElementById("crear-caso-descripcion").value = "";
    abrirPanel("crearCasoPanel", "crearCasoOverlay");
  });

  // Cerrar panel crear caso
  document.getElementById("cerrarCrearCaso")?.addEventListener("click", () => {
    cerrarPanel("crearCasoPanel", "crearCasoOverlay");
  });

  document.getElementById("btn-cancelar-crear-caso")?.addEventListener("click", () => {
    cerrarPanel("crearCasoPanel", "crearCasoOverlay");
  });

  // Confirmar crear caso
  document.getElementById("btn-confirmar-crear-caso")?.addEventListener("click", async () => {
    const descripcion = document.getElementById("crear-caso-descripcion").value.trim();
    const idAlerta = document.getElementById("crear-caso-id-alerta").value || null;
    const errorEl = document.getElementById("crear-caso-error");

    if (!descripcion) {
      errorEl.textContent = "La descripción es obligatoria.";
      errorEl.style.display = "block";
      return;
    }

    errorEl.style.display = "none";

    try {
      const response = await fetch("/api/casos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion, idAlerta })
      });
      const data = await response.json();
      cerrarPanel("crearCasoPanel", "crearCasoOverlay");
      await cargarCasos();
      if (data.idCaso) await abrirPanelCaso(data.idCaso);
    } catch (error) {
      console.error("Error creando caso:", error);
    }
  });

  // Auto-abrir panel crear caso si viene de /alertas con params
  if (idAlertaParam && motivoParam) {
    document.getElementById("crear-caso-id-alerta").value = idAlertaParam;
    document.getElementById("crear-caso-alerta-texto").textContent = `#${idAlertaParam} — ${motivoParam}`;
    document.getElementById("crear-caso-alerta-preview").style.display = "block";
    abrirPanel("crearCasoPanel", "crearCasoOverlay");
  }
});

// Función global para abrir crear caso desde alertas
window.abrirCrearCasoDesdeAlerta = (idAlerta, motivo) => {
  document.getElementById("crear-caso-id-alerta").value = idAlerta;
  document.getElementById("crear-caso-alerta-texto").textContent = `#${idAlerta} — ${motivo}`;
  document.getElementById("crear-caso-alerta-preview").style.display = "block";
  document.getElementById("crear-caso-descripcion").value = "";
  abrirPanel("crearCasoPanel", "crearCasoOverlay");
};