import { getUsers, setActiveUser } from "./storage.js";
import { initNavbar } from "./common.js";

const form = document.getElementById("login-user");
const message = document.getElementById("login-msg");

function showMessage(text, ok) {
    message.textContent = text;
    message.className = `mt-3 mb-0 ${ok ? "text-success" : "text-danger"}`;
    message.hidden = false;
}

function login(evento) {
    evento.preventDefault();

    form.classList.add("was-validated");

    if (!form.checkValidity()) {
        showMessage("Revisa los campos marcados en rojo.", false);
        return;
    }

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;   

    try {
        const users =  getUsers();
        const user = users.find((item) => item.email === email && item.password === password);

        if (!user) {
            showMessage("Correo o contraseña incorrectos.", false);
            return;
        }

        setActiveUser(user.email);

        form.reset();
        form.classList.remove("was-validated");

        window.location.href = "index.html";
    } catch (error) {
        console.error(error);
        showMessage("No se ha podido acceder al almacenamiento del navegador.", false);
    }
}

function start() {
    initNavbar();   
}

form.addEventListener("submit", login);
document.addEventListener("DOMContentLoaded", start);