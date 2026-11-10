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
const canvas = document.getElementById("graphic");

let exchanges = []; 

async function drawTable() {

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

async function drawChart() {
    debugger;
    const ctx = canvas.getContext("2d");
    const css = getComputedStyle(document.documentElement);
    const offerColor = css.getPropertyValue("--offer-color").trim();
    const petitionColor = css.getPropertyValue("--petition-color").trim();

    canvas.width = canvas.clientWidth;
    canvas.height = 260;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const data = {};
    exchanges.forEach((item) => {
        data[item.lang] ??= { Oferta: 0, Petición: 0 };
        data[item.lang][item.service]++;
    });

    const languages = Object.keys(data);
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";

    if (languages.length === 0) {
        ctx.fillStyle = "#888";
        ctx.fillText("No hay intercambios que mostrar", canvas.width / 2, canvas.height / 2);
        return;
    }

    const margin = { up: 30, down: 40, left: 30 };
    const utilHeight = canvas.height - margin.up - margin.down;
    const weightGroup = (canvas.width - margin.left) / languages.length;
    const weightBar = Math.min(30, weightGroup / 3);
    const max = Math.max(...languages.flatMap((i) => [data[i].Oferta, data[i].Petición]));
    const yAxis = canvas.height - margin.down;

    ctx.strokeStyle = "#ccc";
    ctx.beginPath();
    ctx.moveTo(margin.left, yAxis);
    ctx.lineTo(canvas.width, yAxis);
    ctx.stroke();

    languages.forEach((lang, i) => {
        const center = margin.left + weightGroup * i + weightGroup / 2;

        [["Oferta", offerColor, -weightBar], ["Petición", petitionColor, 0]].forEach(([key, color, displacement]) => {
            const value = data[lang][key];
            const height = (value / max) * utilHeight;
            const x = center + displacement;

            ctx.fillStyle = color;
            ctx.fillRect(x, yAxis - height, weightBar, height);

            if (value > 0) {
                ctx.fillStyle = "#222";
                ctx.fillText(value, x + weightBar / 2, yAxis - height - 5);
            }
        });

        ctx.fillStyle = "#222";
        ctx.fillText(lang, center, yAxis + 18);
    });

    ctx.textAlign = "left";
    [["Ofertas", offerColor], ["Peticiones", petitionColor]].forEach(([text, color], i) => {
        const x = margin.left + i * 100;
        ctx.fillStyle = color;
        ctx.fillRect(x, 5, 12, 12);
        ctx.fillStyle = "#222";
        ctx.fillText(text, x + 18, 15);
    });
}

async function refresh() {
    try {
        exchanges = await obtainExchanges();
    } catch (error) {
        console.error(error);
        showMessage(message, "No se han podido leer los intercambios de IndexedDB.", false);
        exchanges = [];
    }

    drawTable();
    drawChart();
}

async function addExchange(evento) {
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
    await refresh();
}

async function deleteExchange(id) {
    removeExchange(id);
    await refresh();
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

    refresh();
}

form.addEventListener("submit", addExchange);
window.addEventListener("resize", drawChart);
document.addEventListener("DOMContentLoaded", start);