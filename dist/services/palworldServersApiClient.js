"use strict";
// Cliente para consumir endpoints de servidores da API oficial do Palworld
// https://docs.palworldgame.com/category/rest-api
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServers = getServers;
exports.getServerById = getServerById;
const API_BASE = "https://api.palworldgame.com";
async function getServers() {
    const res = await fetch(`${API_BASE}/servers`, { cache: "no-store" });
    if (!res.ok)
        throw new Error("Erro ao buscar servidores");
    return res.json();
}
async function getServerById(id) {
    const res = await fetch(`${API_BASE}/servers/${id}`, { cache: "no-store" });
    if (!res.ok)
        throw new Error("Erro ao buscar servidor");
    return res.json();
}
