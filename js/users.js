import { users, lang } from "./data.js";

const form = document.getElementById("form-add-user");
const table = document.getElementById("users-table");
const count = document.getElementById("count");
const langSelect = document.getElementById("native-lang");

function drawTable() {
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

    const id = users.length ? users[users.length - 1].id + 1 : 1;

    users.push({
        id: id,
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        nativeLang: langSelect.value,
        city: document.getElementById("city").value.trim()
    });

    form.reset();
    drawTable();
}

function deleteUser(id) {
    const index = users.findIndex((user) => user.id === id);

    users.splice(index, 1);
    drawTable();
}

function fillLangs() {
    lang.forEach((item) => {
        langSelect.add(new Option(item, item));
    });
}

function start() {
    fillLangs();
    drawTable();
}

form.addEventListener("submit", addUser);
document.addEventListener("DOMContentLoaded", start);
