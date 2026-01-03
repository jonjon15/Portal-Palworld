"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayersFromAPI = getPlayersFromAPI;
exports.findApiPlayerByName = findApiPlayerByName;
exports.getServerInfo = getServerInfo;
exports.getOnlinePlayersCount = getOnlinePlayersCount;
const axios_1 = __importDefault(require("axios"));
function formatPalworldApiError(error) {
    if (axios_1.default.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            return 'Palworld API não autorizada (verifique PALWORLD_API_USER/PALWORLD_API_PASS).';
        }
        if (status) {
            return `Falha ao acessar Palworld API (HTTP ${status}).`;
        }
        return 'Falha ao acessar Palworld API (rede/timeout/DNS).';
    }
    return 'Falha ao acessar Palworld API.';
}
function getPalworldApiClient() {
    const baseURL = (process.env.PALWORLD_API_URL || process.env.PALGUARD_URL || 'http://201.93.248.252:8212').trim();
    const username = (process.env.PALWORLD_API_USER || process.env.PALGUARD_USER || '').trim();
    const password = (process.env.PALWORLD_API_PASS || process.env.PALGUARD_PASSWORD || '').trim();
    if (!username || !password) {
        throw new Error('PALWORLD_API_USER/PALWORLD_API_PASS não estão definidos nas variáveis de ambiente.');
    }
    return axios_1.default.create({
        baseURL,
        auth: {
            username,
            password,
        },
    });
}
function normalizePlayersResponse(data) {
    if (!data) {
        return [];
    }
    if (Array.isArray(data)) {
        return data;
    }
    if (typeof data === 'object') {
        const players = data.players;
        if (Array.isArray(players)) {
            return players;
        }
    }
    return [];
}
// Funções para integração com PalDefender/PalGuard API
async function getPlayersFromAPI() {
    try {
        const palworldApiClient = getPalworldApiClient();
        const response = await palworldApiClient.get('/v1/api/players');
        return normalizePlayersResponse(response.data);
    }
    catch (error) {
        const message = formatPalworldApiError(error);
        console.error('Erro ao buscar jogadores da API REST:', message);
        throw new Error(message);
    }
}
async function findApiPlayerByName(playerName) {
    const players = await getPlayersFromAPI();
    const normalizedName = playerName.toLowerCase();
    return players.find((player) => {
        const candidate = player.name || player.accountName;
        return candidate ? candidate.toLowerCase() === normalizedName : false;
    }) || null;
}
async function getServerInfo() {
    try {
        const palworldApiClient = getPalworldApiClient();
        const response = await palworldApiClient.get('/v1/api/server');
        return response.data;
    }
    catch (error) {
        const message = formatPalworldApiError(error);
        console.error('Erro ao buscar informações do servidor:', message);
        throw new Error(message);
    }
}
async function getOnlinePlayersCount() {
    try {
        const players = await getPlayersFromAPI();
        return players.length;
    }
    catch (error) {
        console.error('Erro ao contar jogadores online:', error);
        return 0;
    }
}
