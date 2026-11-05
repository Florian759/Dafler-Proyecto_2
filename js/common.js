import { getActiveUser, removeActiveUser } from "./storage.js";

const loginBtn = document.querySelector(".login-btn-box a");
const userName = document.getElementById("user-name");
const userNameText = document.getElementById("user-name-text");

export function initNavbar() {
    const user = getActiveUser();

    if (user) {
        showActiveUser(user);
        userName.addEventListener("click", logout);
    }   
}

export function showActiveUser(user) {
    loginBtn.hidden = true;
    userNameText.textContent = user.name;
    userName.classList.replace("d-none", "d-flex");
}

export function logout() {
    removeActiveUser(); 
    window.location.href = "login.html";
}

export function showMessage(element, text, ok) {
    element.textContent = text;
    element.className = `alert ${ok ? "alert-success" : "alert-danger"} mt-3 mb-0`;
    element.hidden = false;
}