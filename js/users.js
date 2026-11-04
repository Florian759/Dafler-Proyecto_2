import { getUsers, setUser, removeUser } from "./storage.js";
import { lang } from "./data.js";
import { initNavbar } from "./common.js";

const form = document.getElementById("form-add-user");
const table = document.getElementById("users-table");
const count = document.getElementById("count");
const langSelect = document.getElementById("native-lang");

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

    const user = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        nativeLang: langSelect.value,
        city: document.getElementById("city").value.trim()
    };

    setUser(user);

    form.reset();
    drawTable();
}

function deleteUser(id) {
    removeUser(id);
    drawTable();
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
