document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const loginForm = document.getElementById("login");

  loginBtn?.addEventListener("click", function () {
    loginForm.style.left = "50%";
    loginForm.style.opacity = "1";
    loginBtn.className = "btn white-btn";
  });
});