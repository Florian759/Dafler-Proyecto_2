import { users as defaultUsers } from "./data.js";

const USERS_KEY = "users";
const ACTIVE_USER_KEY = "activeUser";

export function getUsers() {
    const json = localStorage.getItem(USERS_KEY);

    if (json !== null) {
        try {
            return JSON.parse(json);
        } catch {
            console.warn("Datos de usuarios corruptos en localStorage: se restauran los de ejemplo.");
        }
    }

    setUsers(defaultUsers);
    return defaultUsers;
}

export function setUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getActiveUser() {
    const email = localStorage.getItem(ACTIVE_USER_KEY);

    return getUsers().find((u) => u.email === email);
}

export function setActiveUser(email) {
    const user = getUsers().find((u) => u.email === email);

    if (!user) return null;

    localStorage.setItem(ACTIVE_USER_KEY, user.email);
    return user;
}

export function removeActiveUser() {
    if (!getActiveUser()) return false;

    localStorage.removeItem(ACTIVE_USER_KEY);
    return true;
}