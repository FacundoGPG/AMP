async function cargarComponentes() {
  try {
    const navRes = await fetch('/topbar.html');
    const navHtml = await navRes.text();
    document.getElementById('navbar-container').innerHTML = navHtml;

    const sideRes = await fetch('/sidebar.html');
    const sideHtml = await sideRes.text();
    document.getElementById('sidebar-container').innerHTML = sideHtml;

    iniciarSidebar(); // Iniciar Sidebar
    iniciarDropdown(); // Iniciar Dropdown
    iniciarReloj(); // Iniciar Reloj

  } catch (error) {
    console.error('Error cargando componentes:', error);
  }
}

function iniciarSidebar() {
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("close-btn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  closeBtn.addEventListener("click", cerrarSidebar);
  overlay.addEventListener("click", cerrarSidebar);

  function cerrarSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function iniciarDropdown() {
  const btn = document.getElementById("dropdown-btn");
  const menu = document.getElementById("dropdown-menu");

  if (!btn || !menu) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  document.addEventListener("click", () => {
    menu.classList.remove("active");
  });
}

function iniciarReloj() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  function actualizarHora() {
    const ahora = new Date();

    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    const segundos = String(ahora.getSeconds()).padStart(2, "0");

    clock.textContent = `${horas}:${minutos}:${segundos}`;
  }

  actualizarHora();
  setInterval(actualizarHora, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarSidebar();
  iniciarDropdown();
  iniciarReloj();
});

