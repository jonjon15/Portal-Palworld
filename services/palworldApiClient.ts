import axios from 'axios';

export interface PalworldApiPlayer {
  name?: string;
  accountName?: string;
  playerId?: string;
  playeruid?: string;
  userId?: string;
  steamid?: string;
  level?: number;
  location_x?: number;
  location_y?: number;
  location_z?: number;
}

function getPalworldApiClient() {
  const baseURL = (process.env.PALWORLD_API_URL || process.env.PALGUARD_URL || 'http://201.93.248.252:8212').trim();
  const username = (process.env.PALWORLD_API_USER || process.env.PALGUARD_USER || '').trim();
  const password = (process.env.PALWORLD_API_PASS || process.env.PALGUARD_PASSWORD || '').trim();

  if (!username || !password) {
    throw new Error('PALWORLD_API_USER/PALWORLD_API_PASS não estão definidos.');
  }

  return axios.create({
    baseURL,
    auth: { username, password },
  });
}

function normalizePlayersResponse(data: any): PalworldApiPlayer[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && Array.isArray(data.players)) return data.players;
  return [];
}

export async function getPlayersFromAPI(): Promise<PalworldApiPlayer[]> {
  try {
    const client = getPalworldApiClient();
    const response = await client.get('/v1/api/players');
    return normalizePlayersResponse(response.data);
  } catch (error) {
    console.error('Erro ao buscar jogadores da API:', error);
    throw error;
  }
}

export async function findApiPlayerByName(playerName: string): Promise<PalworldApiPlayer | null> {
  const players = await getPlayersFromAPI();
  const normalizedName = playerName.toLowerCase();
  return players.find((p) => {
    const candidate = p.name || p.accountName;
    return candidate ? candidate.toLowerCase() === normalizedName : false;
  }) || null;
}

export async function getServerInfo(): Promise<any> {
  try {
    const client = getPalworldApiClient();
    const response = await client.get('/v1/api/server');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar info do servidor:', error);
    throw error;
  }
}

export async function giveItemToPlayer(steamId: string, itemId: string, quantity: number): Promise<any> {
  try {
    const client = getPalworldApiClient();
    
    // Tentar POST /v1/api/give
    try {
      const response = await client.post('/v1/api/give', {
        userId: steamId,
        itemId: itemId,
        amount: quantity
      });
      return { success: true, method: 'POST /v1/api/give', data: response.data };
    } catch (postError) {
      // Se POST falhar, tentar PUT /v1/api/player/give
      try {
        const response = await client.put('/v1/api/player/give', {
          steamId: steamId,
          itemId: itemId,
          quantity: quantity
        });
        return { success: true, method: 'PUT /v1/api/player/give', data: response.data };
      } catch (putError) {
        // Se ambos falharem, retornar erro
        throw new Error('Nenhum endpoint de API funcionou. Use RCON como fallback.');
      }
    }
  } catch (error) {
    console.error('Erro ao enviar item via API:', error);
    throw error;
  }
}
