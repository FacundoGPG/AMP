const ROL_ACTUAL = document.body.dataset.rol || "";
const esAuditoria = ROL_ACTUAL === "Auditoria";

function aplicarRestriccionesAuditoria() {
  if (!esAuditoria) return;

  // Ocultar botones de acción
  const idsOcultar = [
    "addClientes", "btn-agregar-lista", "btn-nueva-operacion",
    "btn-nuevo-caso", "btn-crear-caso-desde-alerta",
    "btn-guardar-estatus", "btn-cambiar-estatus", "btn-vincular-alerta",
    "btn-agregar-comentario", "btn-guardar-operacion", "guardarEstadoCliente",
    "btn-nuevo-contrato", "btn-guardar-contrato",
    "btn-validar-listas", "btn-nuevo-umbral",
    "valdoc-modal-rechazar", "valdoc-modal-validar", "valdoc-modal-cancelar",
    "exportClientesCSV"
  ];

  idsOcultar.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  // Ocultar tab de documentos pendientes
  document.querySelectorAll(".tab-btn").forEach(btn => {
    if (btn.dataset.table === "documentos-section") {
      btn.style.display = "none";
    }
  });

  // Deshabilitar select de estado del cliente
  const estadoSelect = document.getElementById("estado-cliente-select");
  if (estadoSelect) estadoSelect.disabled = true;

  // Deshabilitar checkboxes de umbrales
  const umbralesEl = document.getElementById("cliente-umbrales-list");
  if (umbralesEl) {
    const observer = new MutationObserver(() => {
      umbralesEl.querySelectorAll(".toggle-umbral").forEach(cb => {
        cb.disabled = true;
        cb.style.cursor = "not-allowed";
      });
      umbralesEl.querySelectorAll(".btn-eliminar-umbral").forEach(btn => {
        btn.style.display = "none";
      });
    });
    observer.observe(umbralesEl, { childList: true, subtree: true });
  }

  // Deshabilitar botones en listas de riesgo
    const listasSection = document.getElementById("listas-section");
    if (listasSection) {
      const observer = new MutationObserver(() => {
        listasSection.querySelectorAll(".btn-editar-lista, .btn-eliminar-lista").forEach(btn => {
          btn.disabled = true;
          btn.style.opacity = "0.4";
          btn.style.cursor = "not-allowed";
          btn.style.pointerEvents = "none";
        });
      });
      observer.observe(listasSection, { childList: true, subtree: true });
    }

  // Bloquear formularios de reporte
  document.querySelectorAll("form[action='/reportes/crear']").forEach(form => {
    form.closest("section")?.style.setProperty("display", "none");
  });

  // Restricciones en panel de casos
  const casoPanel = document.getElementById("casoPanel");
  if (casoPanel) {
    const observer = new MutationObserver(() => {
      const selectEstatus = document.getElementById("caso-select-estatus");
      if (selectEstatus) {
        selectEstatus.disabled = true;
        selectEstatus.style.cursor = "not-allowed";
      }
      ["btn-guardar-estatus", "btn-vincular-alerta", "btn-agregar-comentario"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });
      const inputAlerta = document.getElementById("caso-nueva-alerta-id");
      if (inputAlerta) inputAlerta.style.display = "none";
      const comentario = document.getElementById("caso-comentario");
      if (comentario) comentario.disabled = true;
    });
    observer.observe(casoPanel, { childList: true, subtree: true });
  }

  // Ocultar panel de crear caso
  const crearCasoPanel = document.getElementById("crearCasoPanel");
  if (crearCasoPanel) crearCasoPanel.style.display = "none";
}

document.addEventListener("DOMContentLoaded", aplicarRestriccionesAuditoria);