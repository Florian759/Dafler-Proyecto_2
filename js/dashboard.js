import { getActiveUser, getSelection, obtainExchanges, saveSelection } from "./storage.js";
import { initNavbar } from "./common.js";

const offersCardsContainer = document.getElementById("offers-cards");
const petitionsCardsContainer = document.getElementById("petitions-cards");
const errorBox = document.getElementById("dashboard-error");
const selectionCardsContainer = document.getElementById("selection-cards");
const selectionEmpty = document.getElementById("selection-empty");

let exchanges = [];
let selection = [];
let selectionKey;
let draggedId = null;
let updating = false;

function escapeHTML(value) {
    const element = document.createElement("span");
    element.textContent = value ?? "";
    return element.innerHTML;
}

function getServiceKey(service) {
    return String(service ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function createCard(item, selected = false) {
    const card = document.createElement("div");
    card.className = selected ? "col-12" : "col-12 col-md-6 col-xl-4";

    card.innerHTML = `
        <div class="card ${getServiceKey(item.service) === "oferta" ? "offer" : "petition"}" draggable="true">
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

    const draggable = card.querySelector(".card");
    draggable.addEventListener("dragstart", (event) => {
        draggedId = item.id;
        event.dataTransfer.setData("text/plain", String(item.id));
        event.dataTransfer.effectAllowed = "move";
        draggable.classList.add("opacity-50");
    });
    draggable.addEventListener("dragend", () => {
        draggedId = null;
        draggable.classList.remove("opacity-50");
    });
    return card;
}

function render() {
    const available = exchanges.filter((item) => !selection.includes(item.id));
    const selected = exchanges.filter((item) => selection.includes(item.id));
    offersCardsContainer.replaceChildren(...available.filter((item) => getServiceKey(item.service) === "oferta").map((item) => createCard(item)));
    petitionsCardsContainer.replaceChildren(...available.filter((item) => getServiceKey(item.service) === "peticion").map((item) => createCard(item)));
    selectionCardsContainer.replaceChildren(...selected.map((item) => createCard(item, true)));
    selectionEmpty.hidden = selected.length > 0;
}

async function moveCard(id, toSelection) {
    if (updating || selection.includes(id) === toSelection) {
        return;
    }

    const nextSelection = toSelection ? [...selection, id] : selection.filter((itemId) => itemId !== id);
    updating = true;
    try {
        await saveSelection(nextSelection, selectionKey);
        selection = nextSelection;
        errorBox.hidden = true;
        render();
    } catch (error) {
        console.error(error);
        errorBox.hidden = false;
    } finally {
        updating = false;
    }
}

function setupDropZone(zone, toSelection) {
    zone.addEventListener("dragover", (event) => {
        if (draggedId === null || updating) {
            return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        zone.classList.add("bg-primary-subtle");
    });
    zone.addEventListener("dragleave", (event) => {
        if (!zone.contains(event.relatedTarget)) {
            zone.classList.remove("bg-primary-subtle");
        }
    });
    zone.addEventListener("dragend", () => zone.classList.remove("bg-primary-subtle"));
    zone.addEventListener("drop", (event) => {
        event.preventDefault();
        zone.classList.remove("bg-primary-subtle");
        const id = draggedId;
        draggedId = null;
        if (id !== null && event.dataTransfer.getData("text/plain") === String(id)) {
            return moveCard(id, toSelection);
        }
    });
}

async function refreshExchanges() {
    if (updating) {
        return;
    }
    updating = true;
    try {
        [exchanges, selection] = await Promise.all([obtainExchanges(), getSelection(selectionKey)]);
        errorBox.hidden = true;
        render();
    } catch (error) {
        console.error(error);
        errorBox.hidden = false;
    } finally {
        updating = false;
    }
}

function start() {
    initNavbar();
    selectionKey = getActiveUser()?.email ?? "anonymous";
    setupDropZone(document.getElementById("zone-available"), false);
    setupDropZone(document.getElementById("zone-selection"), true);
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
