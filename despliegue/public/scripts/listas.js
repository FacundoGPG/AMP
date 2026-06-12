let listasData = [];

async function cargarListas() {
  const contenedor = document.getElementById("listas-table");
  if (!contenedor) return;

  try {
    const res    = await fetch("/api/listas");
    const listas = await res.json();
    listasData   = listas;

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
  document.getElementById("lista-modal").style.display = "flex";
}

function abrirModalEditarLista(lista) {
  document.getElementById("lista-modal-titulo").textContent = "Editar lista";
  document.getElementById("lista-modal-id").value = lista.id_lista;
  document.getElementById("lista-modal-tipo").value = lista.tipo_lista;
  document.getElementById("lista-modal-nombre").value = lista.nombre;
  document.getElementById("lista-modal-fuente").value = lista.fuente;
  document.getElementById("lista-modal-error").style.display = "none";
  document.getElementById("lista-modal").style.display = "flex";
}

function cerrarModalLista() {
  document.getElementById("lista-modal").style.display = "none";
}

async function guardarLista() {
  const id      = document.getElementById("lista-modal-id").value;
  const tipo    = document.getElementById("lista-modal-tipo").value;
  const nombre  = document.getElementById("lista-modal-nombre").value.trim();
  const fuente  = document.getElementById("lista-modal-fuente").value.trim();
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

document.addEventListener("DOMContentLoaded", () => {
  cargarListas();

  document.getElementById("btn-agregar-lista")
    ?.addEventListener("click", abrirModalAgregarLista);
  document.getElementById("lista-modal-cerrar")
    ?.addEventListener("click", cerrarModalLista);
  document.getElementById("lista-modal-cancelar")
    ?.addEventListener("click", cerrarModalLista);
  document.getElementById("lista-modal-guardar")
    ?.addEventListener("click", guardarLista);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModalLista();
  });
});