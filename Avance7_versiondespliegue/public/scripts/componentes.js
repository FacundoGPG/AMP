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

function iniciarConfigPanel() {
  const openBtn = document.getElementById("openConfig");
  const openBtn2 = document.getElementById("openConfig-TopBar");
  const closeBtn = document.getElementById("closeConfig");
  const overlay = document.getElementById("overlay");
  const panel = document.getElementById("configPanel");
  const sidebar = document.getElementById("sidebar");
  const menu = document.getElementById("dropdown-menu");

  if (!closeBtn || !overlay || !panel) return;

  function abrirConfig() {
    overlay.classList.add("active");
    panel.classList.add("active");

    if (sidebar) sidebar.classList.remove("active");
    if (menu) menu.classList.remove("active");

    document.activeElement.blur();
  }

  function cerrarPanel() {
    overlay.classList.remove("active");
    panel.classList.remove("active");
  }

  if (openBtn) {
    openBtn.addEventListener("click", abrirConfig);
  }

  if (openBtn2) {
    openBtn2.addEventListener("click", abrirConfig);
  }

  closeBtn.addEventListener("click", cerrarPanel);
  overlay.addEventListener("click", cerrarPanel);
}

function iniciarCookies() {

    const banner = document.getElementById("cookie-banner");
    const overlay = document.getElementById("overlay");

    if (!banner) return;

    const Cookies = {

        set(name, value, days = 365) {

            const expires = new Date(
                Date.now() + days * 864e5
            ).toUTCString();

            document.cookie =
                `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
        },

        get(name) {

            return document.cookie
                .split("; ")
                .find(row => row.startsWith(`${name}=`))
                ?.split("=")[1] ?? null;
        }
    };

    function mostrarBanner() {

        banner.classList.add("active");

        if (overlay) {
            overlay.classList.add("active");
        }
    }

    function ocultarBanner() {

        banner.classList.remove("active");

        if (overlay) {
            overlay.classList.remove("active");
        }
    }

    const cookiesAceptadas =
        Cookies.get("cookiesAceptadas");

    if (!cookiesAceptadas) {

        mostrarBanner();

    } else {

        ocultarBanner();
    }

    const acceptBtn =
        document.querySelector(".accept-btn");

    const rejectBtn =
        document.querySelector(".reject-btn");

    if (acceptBtn) {

        acceptBtn.addEventListener("click", () => {

            Cookies.set("cookiesAceptadas", "true");

            ocultarBanner();
        });
    }

    if (rejectBtn) {

        rejectBtn.addEventListener("click", () => {

            Cookies.set("cookiesAceptadas", "false");

            ocultarBanner();
        });
    }
}

function IniciarTodo() {
  iniciarSidebar();
  iniciarDropdown();
  iniciarReloj();
  iniciarConfigPanel();
  iniciarCookies();
}
document.addEventListener("DOMContentLoaded", () => {
  IniciarTodo();
});

