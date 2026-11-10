import { lang, levels, type, users } from "./data.js";
import { initNavbar, showMessage } from "./common.js";
import { obtainExchanges, createExchange, removeExchange } from "./storage.js";

const form = document.getElementById("form-add-exchange");
const table = document.getElementById("exchange-table");
const count = document.getElementById("count");
const languageHTML = document.getElementById("language");
const levelHTML = document.getElementById("level");
const modalityHTML = document.getElementById("modality");
const userHTML = document.getElementById("user");
const message = document.getElementById("mensaje");

async function drawTable() {
    let exchanges = [];

    try {
        exchanges = await obtainExchanges();
    } catch (error) {
        console.error(error);
        showMessage(message, "No se han podido leer los intercambios de IndexedDB.", false);
    }

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
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
        showMessage(message, "Revisa los campos marcados en rojo.", false);
        return;
    }

    try {
        createExchange({
            service: document.getElementById("service").value.trim(),
            lang: languageHTML.value,
            level: levelHTML.value,
            type: modalityHTML.value,
            user: userHTML.value,
            title: document.getElementById("title").value.trim(),
            description: document.getElementById("description").value.trim(),
            date: document.getElementById("date").value.trim(),
        });
    } catch (error) {
        showMessage(message, error.message, false);
    }
    form.reset();
    form.classList.remove("was-validated");
    drawTable();
}

function deleteExchange(id) {
    removeExchange(id);
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
    initNavbar();

    fillLangs();
    fillLevels();
    fillModalities();
    fillUsers();

    drawTable();
}


form.addEventListener("submit", addExchange);
document.addEventListener("DOMContentLoaded", start);