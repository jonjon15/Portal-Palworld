import { verifyToken } from '../../lib/jwt';
import { applyCorsNode } from '../../lib/cors';
import { getPlayersFromAPI } from '../../services/palworldApiClient';

function getAdminUsernames(): string[] {
  const raw = process.env.ADMIN_USERNAMES || '';
  return raw.split(',').map(s => s.trim()).filter(Boolean).map(s => s.toLowerCase());
}

export default async function handler(req: any, res: any) {
  const cors = applyCorsNode(req, res);
  if (cors.blocked) return;

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const adminUsernames = getAdminUsernames();
  if (adminUsernames.length === 0) {
    return res.status(403).json({ error: 'Admin não configurado' });
  }

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Token inválido' });

    // Buscar jogadores online via API do PalDefender
    const apiPlayers = await getPlayersFromAPI();
    
    const players = apiPlayers.map(p => ({
      name: p.name || p.accountName || 'Jogador Desconhecido',
      playerUid: p.playerId || p.playeruid || 'unknown',
      steamId: p.userId || p.steamid || 'unknown'
    }));

    return res.status(200).json({ players });

  } catch (err: any) {
    console.error('Erro ao buscar jogadores online:', err);
    return res.status(500).json({ error: err?.message || 'Erro ao buscar jogadores', players: [] });
  }
}
