import { exchanges } from "./data.js";

const offersCardsContainer = document.getElementById("offers-cards");
const petitionsCardsContainer = document.getElementById("petitions-cards");

function drawOfferCard(offers) {
    const cards = offers.map((item) => {
        const card = document.createElement("div");
        card.className = "col-12 col-sm-6 col-lg-3";

        card.innerHTML = `
                <div class="card offer">
                    <div class="card-header">
                        <h3>${item.title}</h3>
                        <h4>${item.date}</h4>
                    </div>
                    <div class="card-description">
                        <p>${item.description}</p>
                    </div>
                    <div class="card-author">
                        <p>Publicado por: ${item.user}</p>
                    </div>
                </div>
        `;

        return card;
    });

  offersCardsContainer.replaceChildren(...cards);
}

function drawPetitionCard(petitions) {
    const cards = petitions.map((item) => {
        const card = document.createElement("div");
        card.className = "col-12 col-sm-6 col-lg-3";

        card.innerHTML = `
                <div class="card petition">
                    <div class="card-header">
                        <h3>${item.title}</h3>
                        <h4>${item.date}</h4>
                    </div>
                    <div class="card-description">
                        <p>${item.description}</p>
                    </div>
                    <div class="card-author">
                        <p>Publicado por: ${item.user}</p>
                    </div>
                </div>
        `;

        return card;
    });

  petitionsCardsContainer.replaceChildren(...cards);
}

function start() {
    const filteredExchangesOffers = exchanges.filter((item) => item.service === "Oferta");
    const filteredExchangesPetitions = exchanges.filter((item) => item.service === "Petición");

    console.log("Filtered Exchanges Offers:", filteredExchangesOffers);
    console.log("Filtered Exchanges Petitions:", filteredExchangesPetitions);   

    drawOfferCard(filteredExchangesOffers);
    drawPetitionCard(filteredExchangesPetitions);
}

document.addEventListener("DOMContentLoaded", start);
