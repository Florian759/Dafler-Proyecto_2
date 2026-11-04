import { users } from "./data.js";

const form = document.getElementById("login-user");
const message = document.getElementById("login-msg");
const loginBtn = document.querySelector(".login-btn-box a");
const userName = document.getElementById("user-name");
const userNameText = document.getElementById("user-name-text");

function showMessage(text, ok) {
    message.textContent = text;
    message.className = `mt-3 mb-0 ${ok ? "text-success" : "text-danger"}`;
    message.hidden = false;
}

function login(evento) {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const user = users.find((item) => item.email === email && item.password === password);

    if (!user) {
        showMessage("Correo o contraseña incorrectos.", false);
        return;
    }

    showMessage(`Te has logeado como ${user.name}.`, true);

    loginBtn.hidden = true;
    userNameText.textContent = user.name;
    userName.classList.replace("d-none", "d-flex");

    form.reset();
}

form.addEventListener("submit", login);
