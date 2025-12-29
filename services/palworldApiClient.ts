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
