import { applyCorsNode } from '../../lib/cors';
import { getPlayersFromAPI } from '../../services/palworldApiClient';

export default async function handler(req: any, res: any) {
  const cors = applyCorsNode(req, res);
  if (cors.blocked) return;

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Buscar jogadores online da API do PalDefender com posições reais
    const apiPlayers = await getPlayersFromAPI();
    
    const players = apiPlayers.map(p => ({
      id: p.playerId || p.playeruid || 'unknown',
      name: p.name || p.accountName || 'Jogador Desconhecido',
      x: p.location_x ?? 0,
      y: p.location_y ?? 0,
      z: p.location_z ?? 0,
      level: p.level ?? 1
    }));

    return res.status(200).json({ players });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro';
    console.error('Erro ao buscar jogadores online:', error);
    return res.status(500).json({ error: message, players: [] });
  }
}
