import { users as defaultUsers, exchanges as initialExchanges } from "./data.js";

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

export function getUserById(id) {
    const users = getUsers();
    const user = users.find((u) => u.id === id);
    
    return user;
}

export function getUserByEmail(email) {
    const users = getUsers();
    const user = users.find((u) => u.email === email);
    
    return user;
}

export function setUser(user) {
    const users = getUsers();
    const id = users.length ? users[users.length - 1].id + 1 : 1;

    users.push({id, ...user});

    setUsers(users);
}

export function removeUserById(id) {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === id);

    if (index !== -1) {
        users.splice(index, 1);
        setUsers(users);
    }
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

const DB_NAME = "tandemDafler";
const DB_VERSION = 1;
let connect;

function openDB() {
    connect ??= new Promise((resolve, reject) => {
        const petition = indexedDB.open(DB_NAME, DB_VERSION);

        petition.onupgradeneeded = () => {
            const db = petition.result;
            const exchanges = db.createObjectStore("exchanges", { keyPath: "id", autoIncrement: true });
            initialExchanges.forEach((item) => exchanges.add(item));
            db.createObjectStore("selection", { keyPath: "email" });
        };

        petition.onsuccess = () => resolve(petition.result);
        petition.onerror = () => reject(petition.error);
    });

    return connect;
}

async function operate(storage, mode, operation) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storage, mode);
        const petition = operation(transaction.objectStore(storage));

        transaction.oncomplete = () => resolve(petition.result);
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    });
}

export function obtainExchanges() {
    return operate("exchanges", "readonly", (store) => store.getAll());
}

export function createExchange(datos) {
    return operate("exchanges", "readwrite", (store) => store.add(datos));
}

export function removeExchange(id) {
    return operate("exchanges", "readwrite", (store) => store.delete(id));
}