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

function cerrarPanel() {
  document
    .querySelectorAll(".cliente-panel.active, .config-panel.active")
    .forEach((panel) => panel.classList.remove("active"));

  document
    .querySelectorAll(".overlay.active")
    .forEach((overlay) => overlay.classList.remove("active"));
}

function iniciarCierreGlobalPaneles() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      cerrarPanel();
    }
  });

  document.addEventListener("click", (event) => {
    const overlay = event.target.closest(".overlay.active");

    if (overlay && event.target === overlay) {
      cerrarPanel();
    }
  });
}

function IniciarTodo() {

  iniciarDropdown();
  iniciarReloj();
  iniciarCookies();
  iniciarCierreGlobalPaneles();
}
document.addEventListener("DOMContentLoaded", () => {
  IniciarTodo();
});

