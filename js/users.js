import { getUsers, setUser, removeUserById, getUserById, getUserByEmail } from "./storage.js";
import { lang } from "./data.js";
import { initNavbar, showMessage } from "./common.js";

const form = document.getElementById("form-add-user");
const table = document.getElementById("users-table");
const count = document.getElementById("count");
const langSelect = document.getElementById("native-lang");
const message = document.getElementById("mensaje");

function drawTable() {
    const users = getUsers();
    const rows = users.map((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.nativeLang}</td>
            <td>${item.city}</td>
            <td><button class="btn btn-danger btn-sm">Eliminar</button></td>
        `;

        row.querySelector("button").addEventListener("click", () => deleteUser(item.id));

        return row;
    });

    table.replaceChildren(...rows);

    count.textContent = users.length;
}

function addUser(evento) {
    evento.preventDefault();
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
        showMessage(message, "Revisa los campos marcados en rojo.", false);
        return;
    }

    const email = document.getElementById("email").value.trim();

    try {
        if (getUserByEmail(email)) {
            showMessage(message, "El correo ya está registrado.", false);
            return;
        }

        const user = {
            name: document.getElementById("name").value.trim(),
            email: email,
            password: document.getElementById("password").value,
            nativeLang: langSelect.value,
            city: document.getElementById("city").value.trim()
        };

        setUser(user);
        showMessage(message, `Usuario ${user.name} creado.`, true);

        form.reset();
        form.classList.remove("was-validated");
        drawTable();
    } catch (error) {
        showMessage(message, error.message, false);
    }
}

function deleteUser(id) {
    const user = getUserById(id);

    if (user && confirm(`¿Estás seguro de que deseas eliminar el usuario "${user.name}"?`)) {
        removeUserById(id);
        drawTable();
    }
}

function fillLangs() {
    lang.forEach((item) => {
        langSelect.add(new Option(item, item));
    });
}

function start() {
    initNavbar();

    fillLangs();
    drawTable();
}

form.addEventListener("submit", addUser);
document.addEventListener("DOMContentLoaded", start);
