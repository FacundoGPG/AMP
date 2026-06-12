let umbralesAdminData = [];
let umbralesYaCargados = false;
let gridUmbrales = null;

async function cargarUmbralesAdmin() {
  console.log("cargarUmbralesAdmin llamado");
  const contenedor = document.getElementById("umbrales-table");
  console.log("contenedor:", contenedor);
  if (!contenedor) return;

  try {
    const res = await fetch("/api/umbrales");
    console.log("status:", res.status);
    const data = await res.json();
    console.log("umbrales recibidos:", data);
    umbralesAdminData = data;

    contenedor.innerHTML = "";

    if (gridUmbrales) {
      gridUmbrales.destroy();
      gridUmbrales = null;
    }

    gridUmbrales = new gridjs.Grid({
      columns: [
        "ID",
        "Nombre",
        "Tipo de alerta",
        { name: "Valor límite", formatter: (v) => `$${Number(v).toLocaleString("es-MX")}` },
        "Nivel",
        "Descripción",
        "Acciones"
      ],
      data: umbralesAdminData.map(u => [
        u.id_umbral,
        u.nombre,
        u.tipo_alerta,
        u.valor_limite,
        u.nivel,
        u.descripcion,
        gridjs.html(`
          <button class="btn btn-sm btn-light btn-editar-umbral" data-id="${u.id_umbral}">Editar</button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar-umbral-global" data-id="${u.id_umbral}" data-nombre="${u.nombre}" style="margin-left:4px">✕</button>
        `)
      ]),
      search: true,
      sort: true,
      pagination: { limit: 10 }
    }).render(contenedor);

    contenedor.addEventListener("click", (e) => {
      const btnEditar = e.target.closest(".btn-editar-umbral");
      const btnEliminar = e.target.closest(".btn-eliminar-umbral-global");

      if (btnEditar) {
        const umbral = umbralesAdminData.find(u => u.id_umbral == btnEditar.dataset.id);
        if (umbral) abrirModalEditarUmbral(umbral);
      }

      if (btnEliminar) {
        eliminarUmbralGlobal(btnEliminar.dataset.id, btnEliminar.dataset.nombre);
      }
    });

  } catch (err) {
    console.error("Error cargando umbrales:", err);
    contenedor.innerHTML = "<p class='text-danger'>Error al cargar umbrales.</p>";
  }
}


function abrirModalNuevoUmbralGlobal() {
  document.getElementById("umbral-edit-titulo").textContent = "Nuevo umbral";
  document.getElementById("umbral-edit-id").value           = "";
  document.getElementById("umbral-edit-nombre").value       = "";
  document.getElementById("umbral-edit-tipo").selectedIndex  = 0;
  document.getElementById("umbral-edit-valor").value        = "";
  document.getElementById("umbral-edit-nivel").selectedIndex = 0;
  document.getElementById("umbral-edit-descripcion").value  = "";
  document.getElementById("umbral-edit-cliente").value      = "";
  document.getElementById("umbral-edit-error").style.display = "none";
  document.getElementById("umbralAdminOverlay").classList.add("active");
  document.getElementById("umbralAdminPanel").classList.add("active");
}

function cerrarModalUmbral() {
  document.getElementById("umbralAdminOverlay").classList.remove("active");
  document.getElementById("umbralAdminPanel").classList.remove("active");
}

function abrirModalEditarUmbral(umbral) {
  document.getElementById("umbral-edit-titulo").textContent = "Editar umbral";
  document.getElementById("umbral-edit-id").value           = umbral.id_umbral;
  document.getElementById("umbral-edit-nombre").value       = umbral.nombre;
  document.getElementById("umbral-edit-tipo").value         = umbral.tipo_alerta;
  document.getElementById("umbral-edit-valor").value        = umbral.valor_limite;
  document.getElementById("umbral-edit-nivel").value        = umbral.nivel;
  document.getElementById("umbral-edit-descripcion").value  = umbral.descripcion;
  document.getElementById("umbral-edit-cliente").value      = umbral.id_cliente ?? "";
  document.getElementById("umbral-edit-error").style.display = "none";
  document.getElementById("umbralAdminOverlay").classList.add("active");
  document.getElementById("umbralAdminPanel").classList.add("active");
}

async function guardarUmbralAdmin() {
  const id           = document.getElementById("umbral-edit-id").value;
  const nombre       = document.getElementById("umbral-edit-nombre").value.trim();
  const tipo_alerta  = document.getElementById("umbral-edit-tipo").value.trim();
  const valor_limite = document.getElementById("umbral-edit-valor").value;
  const nivel        = document.getElementById("umbral-edit-nivel").value;
  const descripcion  = document.getElementById("umbral-edit-descripcion").value.trim();
  const errorEl      = document.getElementById("umbral-edit-error");

  if (!nombre || !tipo_alerta || !valor_limite) {
    errorEl.textContent = "Nombre, tipo de alerta y valor límite son obligatorios.";
    errorEl.style.display = "block";
    return;
  }

  try {
    const esNuevo = id === "";
    const res = await fetch(esNuevo ? "/api/umbrales" : `/api/umbrales/${id}`, {
      method: esNuevo ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre, tipo_alerta,
        valor_limite: Number(valor_limite),
        nivel, descripcion,
        id_cliente: document.getElementById("umbral-edit-cliente").value || null
      })
    });

    if (!res.ok) {
      const data = await res.json();
      errorEl.textContent = data.error || "Error al guardar";
      errorEl.style.display = "block";
      return;
    }

    cerrarModalUmbral();
    cargarUmbralesAdmin();
  } catch {
    errorEl.textContent = "Error de conexión";
    errorEl.style.display = "block";
  }
}

async function eliminarUmbralGlobal(id, nombre) {
  if (!confirm(`¿Eliminar el umbral "${nombre}"? Se desactivará para todos los clientes.`)) return;

  try {
    const res = await fetch(`/api/umbrales/${id}`, { method: "DELETE" });
    if (res.ok) {
      cargarUmbralesAdmin();
    } else {
      const data = await res.json();
      alert(data.error || "Error al eliminar");
    }
  } catch {
    alert("Error de conexión");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cerrarUmbralAdminPanel")
    ?.addEventListener("click", cerrarModalUmbral);
  document.getElementById("umbralAdminOverlay")
    ?.addEventListener("click", cerrarModalUmbral);
  document.getElementById("umbral-edit-guardar")
    ?.addEventListener("click", guardarUmbralAdmin);
  document.getElementById("btn-nuevo-umbral-global")
    ?.addEventListener("click", abrirModalNuevoUmbralGlobal);

  document.querySelector('[data-table="umbrales-section"]')
    ?.addEventListener("click", () => {
      setTimeout(() => cargarUmbralesAdmin(), 50);
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModalUmbral();
  });
});