import { getActiveUser } from "./storage.js";

const loginBtn = document.querySelector(".login-btn-box a");
const userName = document.getElementById("user-name");
const userNameText = document.getElementById("user-name-text");

export function initNavbar() {
    const user = getActiveUser();

    if (!user) return;

    // debugger;

    loginBtn.hidden = true;
    userNameText.textContent = user.name;
    userName.classList.replace("d-none", "d-flex");
    // return mostrarUsuarioActivo();   
}