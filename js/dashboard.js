import { obtainExchanges } from "./storage.js";
import { initNavbar } from "./common.js";

const offersCardsContainer = document.getElementById("offers-cards");
const petitionsCardsContainer = document.getElementById("petitions-cards");
const errorBox = document.getElementById("dashboard-error");

let exchanges = [];

function escapeHTML(value) {
    const element = document.createElement("span");
    element.textContent = value ?? "";
    return element.innerHTML;
}

function getServiceKey(service) {
    return String(service ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function createCard(item) {
    const card = document.createElement("div");
    card.className = "col-12 col-md-6 col-xl-4";

    card.innerHTML = `
        <div class="card ${getServiceKey(item.service) === "oferta" ? "offer" : "petition"}">
            <div class="card-header">
                <h3>${escapeHTML(item.title)}</h3>
                <h4>${escapeHTML(item.date)}</h4>
            </div>
            <div class="card-description">
                <p>${escapeHTML(item.description)}</p>
            </div>
            <div class="card-author">
                <p>${escapeHTML(item.lang)} · ${escapeHTML(item.level)} · ${escapeHTML(item.type)}</p>
                <p>Publicado por: ${escapeHTML(item.user ?? item.email)}</p>
            </div>
        </div>
    `;

    return card;
}

function render() {
    offersCardsContainer.replaceChildren(...exchanges.filter((item) => getServiceKey(item.service) === "oferta").map(createCard));
    petitionsCardsContainer.replaceChildren(...exchanges.filter((item) => getServiceKey(item.service) === "peticion").map(createCard));
}

async function refreshExchanges() {
    try {
        exchanges = await obtainExchanges();
        errorBox.hidden = true;
    } catch (error) {
        console.error(error);
        errorBox.hidden = false;
    }
    console.log(exchanges);
    debugger
    render();
}

function start() {
    initNavbar();
    return refreshExchanges();
}

document.addEventListener("DOMContentLoaded", start);

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        refreshExchanges();
    }
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        refreshExchanges();
    }
});
