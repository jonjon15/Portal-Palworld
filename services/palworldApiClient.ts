import axios from 'axios';

const PALWORLD_API_URL = process.env.PALWORLD_API_URL || process.env.PALGUARD_URL || 'http://localhost:8212';
const PALWORLD_API_USER = process.env.PALWORLD_API_USER || process.env.PALGUARD_USER || 'admin';
const PALWORLD_API_PASS = process.env.PALWORLD_API_PASS || process.env.PALGUARD_PASSWORD || 'senha';

if (!PALWORLD_API_URL || !PALWORLD_API_USER || !PALWORLD_API_PASS) {
  throw new Error('Palworld API credentials are not set in environment variables.');
}

export const palworldApiClient = axios.create({
  baseURL: PALWORLD_API_URL,
  auth: {
    username: PALWORLD_API_USER,
    password: PALWORLD_API_PASS,
  },
});

// Funções para integração com PalDefender/PalGuard API
export async function getPlayersFromAPI() {
  try {
    const response = await palworldApiClient.get('/v1/api/players');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar jogadores da API:', error);
    return [];
  }
}

export async function getServerInfo() {
  try {
    const response = await palworldApiClient.get('/v1/api/server');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar informações do servidor:', error);
    return null;
  }
}

export async function getOnlinePlayersCount() {
  try {
    const players = await getPlayersFromAPI();
    return Array.isArray(players) ? players.length : 0;
  } catch (error) {
    console.error('Erro ao contar jogadores online:', error);
    return 0;
  }
}
