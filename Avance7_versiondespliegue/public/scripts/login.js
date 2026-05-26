        const loginBtn = document.getElementById("loginBtn");
        const registerBtn = document.getElementById("registerBtn");
        const loginForm = document.getElementById("login");
        const registerForm = document.getElementById("register");

        loginBtn.addEventListener("click", function () {
            loginForm.style.left = "50%";
            loginForm.style.opacity = "1";

            registerForm.style.left = "150%";
            registerForm.style.opacity = "0";

            loginBtn.className = "btn white-btn";
            registerBtn.className = "btn";
        });

        registerBtn.addEventListener("click", function () {
            loginForm.style.left = "-100%";
            loginForm.style.opacity = "0";

            registerForm.style.left = "50%";
            registerForm.style.opacity = "1";

            loginBtn.className = "btn";
            registerBtn.className = "btn white-btn";
        });