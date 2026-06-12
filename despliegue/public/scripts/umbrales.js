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

    if (!data.length) {
      umbralesEl.innerHTML = "<span class='text-muted'>Sin umbrales configurados.</span>";
      return;
    }

    umbralesEl.innerHTML = data.map(u => `
      <div class="umbral-item">
        <div class="umbral-info">
          <strong>${u.nombre || u.tipo_alerta}</strong>
          <small>${u.descripcion}</small>
          <span class="umbral-nivel nivel-${u.nivel?.toLowerCase()}">${u.nivel}</span>
          ${u.es_personalizado ? '<span class="badge bg-secondary ms-1">Personalizado</span>' : ''}
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
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
          ${u.es_personalizado ? `
            <button
              class="btn btn-sm btn-outline-danger btn-eliminar-umbral"
              data-id-umbral="${u.id_umbral}"
              data-id-cliente="${idCliente}"
              title="Eliminar umbral personalizado"
            >✕</button>
          ` : ''}
        </div>
      </div>
    `).join("");

    // Toggle activo/inactivo
    umbralesEl.querySelectorAll(".toggle-umbral").forEach(checkbox => {
      checkbox.addEventListener("change", async (e) => {
        const idUmbral = e.target.dataset.idUmbral;
        const idCli    = e.target.dataset.idCliente;
        const activo   = e.target.checked;
        try {
          await fetch(`/api/clientes/${idCli}/umbrales/${idUmbral}`, {
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

    // Eliminar umbral personalizado
    umbralesEl.querySelectorAll(".btn-eliminar-umbral").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Eliminar este umbral personalizado?")) return;
        const idUmbral = btn.dataset.idUmbral;
        const idCli    = btn.dataset.idCliente;
        try {
          const res = await fetch(`/api/clientes/${idCli}/umbrales/${idUmbral}`, { method: "DELETE" });
          if (res.ok) {
            cargarRiesgoCliente(idCli);
          } else {
            alert("Error al eliminar umbral");
          }
        } catch {
          alert("Error de conexión");
        }
      });
    });

  } catch {
    if (umbralesEl) umbralesEl.innerHTML = "<span class='text-muted'>Sin umbrales configurados.</span>";
  }
}

function abrirUmbralPanel() {
  document.getElementById("umbralOverlay").classList.add("active");
  document.getElementById("umbralPanel").classList.add("active");
}

function cerrarUmbralPanel() {
  document.getElementById("umbralOverlay").classList.remove("active");
  document.getElementById("umbralPanel").classList.remove("active");
}

function abrirModalNuevoUmbral() {
  document.getElementById("umbral-panel-titulo").textContent = "Nuevo umbral";
  document.getElementById("umbral-modal-nombre").value = "";
  document.getElementById("umbral-modal-tipo").selectedIndex = 0;
  document.getElementById("umbral-modal-valor").value = "";
  document.getElementById("umbral-modal-nivel").selectedIndex = 0;
  document.getElementById("umbral-modal-descripcion").value = "";
  document.getElementById("umbral-modal-error").style.display = "none";
  abrirUmbralPanel();
}

async function guardarUmbralPersonalizado() {
  const nombre       = document.getElementById("umbral-modal-nombre").value.trim();
  const tipo_alerta  = document.getElementById("umbral-modal-tipo").value.trim();
  const valor_limite = document.getElementById("umbral-modal-valor").value;
  const nivel        = document.getElementById("umbral-modal-nivel").value;
  const descripcion  = document.getElementById("umbral-modal-descripcion").value.trim();
  const errorEl      = document.getElementById("umbral-modal-error");

  if (!nombre || !tipo_alerta || !valor_limite) {
    errorEl.textContent = "Nombre, tipo de alerta y valor límite son obligatorios.";
    errorEl.style.display = "block";
    return;
  }

  try {
    const res = await fetch(`/api/clientes/${clienteSeleccionado.id_cliente}/umbrales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, tipo_alerta, valor_limite: Number(valor_limite), nivel, descripcion })
    });

    if (!res.ok) {
      const data = await res.json();
      errorEl.textContent = data.error || "Error al guardar";
      errorEl.style.display = "block";
      return;
    }

    cerrarUmbralPanel();
    cargarRiesgoCliente(clienteSeleccionado.id_cliente);
  } catch {
    errorEl.textContent = "Error de conexión";
    errorEl.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
document.getElementById("cerrarUmbralPanel")
    ?.addEventListener("click", cerrarUmbralPanel);
  document.getElementById("umbralOverlay")
    ?.addEventListener("click", cerrarUmbralPanel);
  document.getElementById("umbral-modal-guardar")
    ?.addEventListener("click", guardarUmbralPersonalizado);
  document.getElementById("btn-nuevo-umbral")
    ?.addEventListener("click", abrirModalNuevoUmbral);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarUmbralPanel();
  });
});