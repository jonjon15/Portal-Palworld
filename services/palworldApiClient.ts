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

function trimEnv(value: string | undefined): string {
  return (value || '').trim().replace(/^['\"]+|['\"]+$/g, '');
}

function getPalworldApiClient() {
  const baseURL = trimEnv(process.env.PALWORLD_API_URL || process.env.PALGUARD_URL || 'http://201.93.248.252:8212');
  const username = trimEnv(process.env.PALWORLD_API_USER || process.env.PALGUARD_USER);
  const password = trimEnv(process.env.PALWORLD_API_PASS || process.env.PALGUARD_PASSWORD);

  const bearerToken =
    trimEnv(process.env.PALWORLD_API_BEARER_TOKEN) ||
    trimEnv(process.env.PALDEFENDER_API_TOKEN) ||
    trimEnv(process.env.PALGUARD_BEARER_TOKEN);

  const client = axios.create({ baseURL });

  // Preferir Bearer token (quando configurado)
  if (bearerToken) {
    client.defaults.headers.common.Authorization = `Bearer ${bearerToken}`;
    return client;
  }

  // Senão, tentar Basic auth (quando configurado)
  if (username && password) {
    // Axios suporta Basic via config do request, mas aqui setamos como default.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const basic = Buffer.from(`${username}:${password}`).toString('base64');
    client.defaults.headers.common.Authorization = `Basic ${basic}`;
  }

  // Se não houver credenciais, ainda assim retorna o client: a API pode estar aberta
  return client;
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

function formatAxiosError(err: any): string {
  const status = err?.response?.status;
  const statusText = err?.response?.statusText;
  const data = err?.response?.data;
  const message = err instanceof Error ? err.message : String(err);

  const parts = [message];
  if (status) parts.push(`status=${status}${statusText ? ` (${statusText})` : ''}`);
  if (data !== undefined) {
    try {
      parts.push(`data=${typeof data === 'string' ? data : JSON.stringify(data)}`);
    } catch {
      parts.push('data=[unserializable]');
    }
  }
  return parts.join(' | ');
}

export async function giveItemToPlayer(steamId: string, itemId: string, quantity: number): Promise<any> {
  try {
    const client = getPalworldApiClient();

    const attempts: Array<{
      method: string;
      path: string;
      request: any;
      run: () => Promise<any>;
    }> = [
      {
        method: 'POST',
        path: '/v1/api/give',
        request: { userId: steamId, itemId, amount: quantity },
        run: async () => (await client.post('/v1/api/give', { userId: steamId, itemId, amount: quantity })).data,
      },
      {
        method: 'PUT',
        path: '/v1/api/player/give',
        request: { steamId, itemId, quantity },
        run: async () => (await client.put('/v1/api/player/give', { steamId, itemId, quantity })).data,
      },
      {
        method: 'POST',
        path: '/v1/api/player/give',
        request: { steamId, itemId, quantity },
        run: async () => (await client.post('/v1/api/player/give', { steamId, itemId, quantity })).data,
      },
      {
        method: 'POST',
        path: '/v1/api/player/item',
        request: { playerId: steamId, itemId, count: quantity },
        run: async () => (await client.post('/v1/api/player/item', { playerId: steamId, itemId, count: quantity })).data,
      },
      {
        method: 'POST',
        path: '/v1/api/giveitem',
        request: { userId: steamId, itemId, amount: quantity },
        run: async () => (await client.post('/v1/api/giveitem', { userId: steamId, itemId, amount: quantity })).data,
      },
    ];

    const errors: string[] = [];
    for (const attempt of attempts) {
      try {
        const data = await attempt.run();
        return {
          success: true,
          method: `${attempt.method} ${attempt.path}`,
          data,
        };
      } catch (err) {
        errors.push(`${attempt.method} ${attempt.path}: ${formatAxiosError(err)}`);
      }
    }

    // Se nada funcionou, gerar erro detalhado pra facilitar diagnóstico em produção
    throw new Error(
      [
        'Nenhum endpoint REST do PalDefender respondeu com sucesso.',
        'Tentativas:',
        ...errors.map((e) => `- ${e}`),
        'Dica: confira se a porta 8212 está acessível via IP público e se a API aceita Basic/Bearer.',
      ].join('\n')
    );
  } catch (error) {
    console.error('Erro ao enviar item via API:', error);
    throw error;
  }
}
