import { exchanges, lang, levels, type, users } from "./data.js";

const form = document.getElementById("form-add-exchange");
const table = document.getElementById("exchange-table");
const count = document.getElementById("count");
const languageHTML = document.getElementById("language");
const levelHTML = document.getElementById("level");
const modalityHTML = document.getElementById("modality");
const userHTML = document.getElementById("user");

function drawTable() {
    const rows = exchanges.map((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.service}</td>
            <td>${item.title}</td>
            <td>${item.lang}</td>
            <td>${item.level}</td>
            <td>${item.type}</td>
            <td>${item.user}</td>
            <td>${item.description}</td>
            <td>${item.date}</td>
            <td><button class="btn btn-danger btn-sm">Eliminar</button></td>
        `;

        row.querySelector("button").addEventListener("click", () => deleteExchange(item.id));

        return row;
    });

    table.replaceChildren(...rows);

    count.textContent = exchanges.length;
}

function addExchange(evento) {
    evento.preventDefault();

    const id = exchanges.length ? exchanges[exchanges.length - 1].id + 1 : 1;

    exchanges.push({
        id: id,
        service: document.getElementById("service").value.trim(),
        lang: languageHTML.value,
        level: levelHTML.value,
        type: modalityHTML.value,
        user: userHTML.value,
        title: document.getElementById("title").value.trim(),
        description: document.getElementById("description").value.trim(),
        date: document.getElementById("date").value.trim(),

    });
console.log(exchanges);
    form.reset();
    drawTable();
}

function deleteExchange(id) {
    const index = exchanges.findIndex((exchange) => exchange.id === id);
    exchanges.splice(index, 1);
    drawTable();
}

function fillLangs() {
    lang.forEach((item) => {
        languageHTML.add(new Option(item, item));
    });
}

function fillLevels() {
    levels.forEach((item) => {
        levelHTML.add(new Option(item, item));
    });
}

function fillModalities() {
    type.forEach((item) => {
        modalityHTML.add(new Option(item, item));
    });
}

function fillUsers() {
    users.forEach((item) => {
        userHTML.add(new Option(item.name, item.name));
    });
}

function start() {
    fillLangs();
    fillLevels();
    fillModalities();
    fillUsers();

    drawTable();
}


form.addEventListener("submit", addExchange);
document.addEventListener("DOMContentLoaded", start);