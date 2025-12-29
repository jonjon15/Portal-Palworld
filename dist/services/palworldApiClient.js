"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.palworldApiClient = void 0;
exports.getPlayersFromAPI = getPlayersFromAPI;
exports.getServerInfo = getServerInfo;
exports.getOnlinePlayersCount = getOnlinePlayersCount;
const axios_1 = __importDefault(require("axios"));
const PALWORLD_API_URL = process.env.PALWORLD_API_URL || process.env.PALGUARD_URL || 'http://localhost:8212';
const PALWORLD_API_USER = process.env.PALWORLD_API_USER || process.env.PALGUARD_USER || 'admin';
const PALWORLD_API_PASS = process.env.PALWORLD_API_PASS || process.env.PALGUARD_PASSWORD || 'senha';
if (!PALWORLD_API_URL || !PALWORLD_API_USER || !PALWORLD_API_PASS) {
    throw new Error('Palworld API credentials are not set in environment variables.');
}
exports.palworldApiClient = axios_1.default.create({
    baseURL: PALWORLD_API_URL,
    auth: {
        username: PALWORLD_API_USER,
        password: PALWORLD_API_PASS,
    },
});
// Funções para integração com PalDefender/PalGuard API
async function getPlayersFromAPI() {
    try {
        const response = await exports.palworldApiClient.get('/v1/api/players');
        return response.data;
    }
    catch (error) {
        console.error('Erro ao buscar jogadores da API:', error);
        return [];
    }
}
async function getServerInfo() {
    try {
        const response = await exports.palworldApiClient.get('/v1/api/server');
        return response.data;
    }
    catch (error) {
        console.error('Erro ao buscar informações do servidor:', error);
        return null;
    }
}
async function getOnlinePlayersCount() {
    try {
        const players = await getPlayersFromAPI();
        return Array.isArray(players) ? players.length : 0;
    }
    catch (error) {
        console.error('Erro ao contar jogadores online:', error);
        return 0;
    }
}
