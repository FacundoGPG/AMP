let usuariosCargados = [];
let usuarioSeleccionado = null;
let gridUsuarios;

const sesionEl = document.getElementById("sesion-data");
window.__usuarioId__    = Number(sesionEl?.dataset.id || 0);
window.__usuarioRoles__ = (sesionEl?.dataset.roles || "").split(",").filter(Boolean);

async function cargarUsuarios() {
  const container = document.getElementById("usuarios-table");
  if (!container) return;

  try {
    const response = await fetch("/admin/usuarios");
    usuariosCargados = await response.json();
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    usuariosCargados = [];
  }

 actualizarContadores();

  if (gridUsuarios) {
    gridUsuarios.updateConfig({ data: usuariosCargados.map(u => [
      u.id, u.nombre, u.apellido || "—", u.correo, (u.roles || []).join(", ") || "Sin rol"
    ])}).forceRender();
    setTimeout(agregarClickUsuarios, 300);
    return;
  }

  gridUsuarios = new gridjs.Grid({
    columns: ["ID", "Nombre", "Apellido", "Correo", "Roles"],
    data: usuariosCargados.map(u => [
      u.id, u.nombre, u.apellido || "—", u.correo, (u.roles || []).join(", ") || "Sin rol"
    ]),
    search: true,
    sort: true,
    pagination: { limit: 10 }
  }).render(container);

  setTimeout(agregarClickUsuarios, 300);
}

function actualizarContadores() {
  const total      = document.getElementById("total-usuarios");
  const clientes   = document.getElementById("total-clientes-usr");
  const empleados  = document.getElementById("total-empleados");
  const oficiales  = document.getElementById("total-oficiales");

  if (total)     total.textContent     = usuariosCargados.length;
  if (clientes)  clientes.textContent  = usuariosCargados.filter(u => u.roles?.includes("Cliente")).length;
  if (empleados) empleados.textContent = usuariosCargados.filter(u => u.roles?.includes("Empleado")).length;
  if (oficiales) oficiales.textContent = usuariosCargados.filter(u => u.roles?.includes("Oficial_Cumplimiento")).length;
}

function agregarClickUsuarios() {
  const rows = document.querySelectorAll("#usuarios-table tbody .gridjs-tr");
  rows.forEach(row => {
    row.style.cursor = "pointer";
    row.addEventListener("click", () => {
      const id = Number(row.children[0].textContent.trim());
      const usuario = usuariosCargados.find(u => u.id === id);
      if (!usuario) return;
      abrirPanelUsuario(usuario);
    });
  });
}

function abrirPanelUsuario(usuario) {
  usuarioSeleccionado = usuario;

  document.getElementById("usuario-detail-nombre").textContent = `${usuario.nombre} ${usuario.apellido || ""}`;
  document.getElementById("usuario-detail-correo").textContent = usuario.correo;
  document.getElementById("usuario-detail-rol").textContent = (usuario.roles || []).join(", ") || "Sin rol";
  document.getElementById("editar-nombre").value = usuario.nombre;
  document.getElementById("editar-apellido").value = usuario.apellido || "";
  document.getElementById("editar-rol").value = usuario.roles?.[0] || "";
  document.getElementById("editar-error").style.display = "none";


  const idSesion = window.__usuarioId__;
  const esMismoUsuario = usuario.id === idSesion;
  const rolVictima = usuario.roles?.[0];
  const rolesNoEditables = {
  Administrador:        ["Administrador"],
  Oficial_Cumplimiento: ["Administrador", "Oficial_Cumplimiento", "Auditoria"]
  };
  const miRol = window.__usuarioRoles__?.[0] || "";



  const noEditables = rolesNoEditables[miRol] || [];
  const esRolNoEditable = noEditables.includes(rolVictima);

  const btnGuardar = document.getElementById("btn-guardar-edicion");
  const btnEliminar = document.getElementById("btn-eliminar-usuario");
  const editarError = document.getElementById("editar-error");

  if (esMismoUsuario) {
    btnGuardar.disabled = true;
    btnEliminar.disabled = true;
    editarError.textContent = "No puedes editar o eliminar tu propio usuario.";
    editarError.style.display = "block";
  } else if (esRolNoEditable) {
    btnGuardar.disabled = true;
    btnEliminar.disabled = true;
    editarError.textContent = "No tienes permiso para editar o eliminar este usuario.";
    editarError.style.display = "block";
  } else {
    btnGuardar.disabled = false;
    btnEliminar.disabled = false;
  }

  document.getElementById("usuarioPanel")?.classList.add("active");
  document.getElementById("usuarioOverlay")?.classList.add("active");
}

function cerrarPanelUsuario() {
  document.getElementById("usuarioPanel")?.classList.remove("active");
  document.getElementById("usuarioOverlay")?.classList.remove("active");
  usuarioSeleccionado = null;
}

// Tabs
function iniciarTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".table-section");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.table;
      tabBtns.forEach(b => b.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(targetId)?.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarUsuarios();
  iniciarTabs();

  // Cerrar panel
  document.getElementById("cerrarUsuarioPanel")?.addEventListener("click", cerrarPanelUsuario);
  document.getElementById("usuarioOverlay")?.addEventListener("click", cerrarPanelUsuario);

  // Guardar edición
  document.getElementById("btn-guardar-edicion")?.addEventListener("click", async () => {
    if (!usuarioSeleccionado) return;

    const nombre   = document.getElementById("editar-nombre").value.trim();
    const apellido = document.getElementById("editar-apellido").value.trim();
    const rol      = document.getElementById("editar-rol").value;
    const errorEl  = document.getElementById("editar-error");

    if (!nombre || !rol) {
      errorEl.textContent = "Nombre y rol son obligatorios.";
      errorEl.style.display = "block";
      return;
    }

    try {
      const res = await fetch(`/admin/usuarios/${usuarioSeleccionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, rol })
      });

      const data = await res.json();
      if (!res.ok) {
        errorEl.textContent = data.error || "Error al guardar.";
        errorEl.style.display = "block";
        return;
      }

      cerrarPanelUsuario();
      document.getElementById("usuarios-table").innerHTML = "";
      await cargarUsuarios();
    } catch {
      errorEl.textContent = "Error de conexión.";
      errorEl.style.display = "block";
    }
  });

  // Eliminar usuario
  document.getElementById("btn-eliminar-usuario")?.addEventListener("click", async () => {
    if (!usuarioSeleccionado) return;
    if (!confirm(`¿Eliminar al usuario ${usuarioSeleccionado.correo}? Esta acción no se puede deshacer.`)) return;

    try {
      const res = await fetch(`/admin/usuarios/${usuarioSeleccionado.id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al eliminar.");
        return;
      }

      cerrarPanelUsuario();
      document.getElementById("usuarios-table").innerHTML = "";
      await cargarUsuarios();
    } catch {
      alert("Error de conexión.");
    }
  });

  // Crear usuario
  document.getElementById("btn-crear-usuario")?.addEventListener("click", async () => {
    const nombre     = document.getElementById("crear-nombre").value.trim();
    const apellido   = document.getElementById("crear-apellido").value.trim();
    const correo     = document.getElementById("crear-correo").value.trim();
    const contrasena = document.getElementById("crear-contrasena").value.trim();
    const rol        = document.getElementById("crear-rol").value;
    const errorEl    = document.getElementById("crear-error");

    if (!nombre || !correo || !contrasena || !rol) {
      errorEl.textContent = "Todos los campos son obligatorios.";
      errorEl.style.display = "block";
      return;
    }

    errorEl.style.display = "none";

    try {
      const res = await fetch("/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, correo, contrasena, rol })
      });

      const data = await res.json();
      if (!res.ok) {
        errorEl.textContent = data.error || "Error al crear usuario.";
        errorEl.style.display = "block";
        return;
      }

      // Limpiar form y volver a la lista
      document.getElementById("crear-nombre").value = "";
      document.getElementById("crear-apellido").value = "";
      document.getElementById("crear-correo").value = "";
      document.getElementById("crear-contrasena").value = "";
      document.getElementById("crear-rol").value = "";

      document.getElementById("usuarios-table").innerHTML = "";
      await cargarUsuarios();
    } catch {
      errorEl.textContent = "Error de conexión.";
      errorEl.style.display = "block";
    }
  });
});
