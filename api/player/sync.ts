import { prisma } from '../../lib/prisma';
import { getPlayerInfoStrict } from '../../services/playerService';
import { verifyToken } from '../../lib/jwt';
import { applyCorsNode } from '../../lib/cors';

export default async function handler(req: any, res: any) {
  const cors = applyCorsNode(req, res);
  if (cors.blocked) return;

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { player: true },
    });

    if (!user || !user.player) {
      return res.status(404).json({ error: 'Usuário ou jogador não encontrado.' });
    }

    let playerInfo = null;
    try {
      playerInfo = await getPlayerInfoStrict(user.player.name);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao acessar Palworld API.';
      return res.status(502).json({ error: message });
    }

    if (!playerInfo) {
      return res.status(404).json({ error: 'Jogador não está online no servidor.' });
    }

    const updatedPlayer = await prisma.player.update({
      where: { id: user.player.id },
      data: {
        level: playerInfo.level || user.player.level,
        x: playerInfo.x || user.player.x,
        y: playerInfo.y || user.player.y,
        z: playerInfo.z || user.player.z,
      },
    });

    return res.status(200).json({
      message: 'Dados sincronizados com sucesso.',
      player: {
        name: updatedPlayer.name,
        level: updatedPlayer.level,
        x: updatedPlayer.x,
        y: updatedPlayer.y,
        z: updatedPlayer.z,
      },
    });
  } catch (error) {
    console.error('Erro ao sincronizar jogador:', error);
    return res.status(500).json({ error: 'Erro ao sincronizar dados do jogador.' });
  }
}
