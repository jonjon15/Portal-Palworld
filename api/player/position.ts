import { prisma } from '../../lib/prisma';
import { verifyToken } from '../../lib/jwt';
import { applyCorsNode } from '../../lib/cors';

export default async function handler(req: any, res: any) {
  // Configurar CORS (restrito por env)
  const cors = applyCorsNode(req, res);
  if (cors.blocked) return;

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
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

    return res.status(200).json({
      player: {
        name: user.player.name,
        level: user.player.level,
        x: user.player.x,
        y: user.player.y,
        z: user.player.z,
        updatedAt: user.player.updatedAt,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar posição do jogador:', error);
    return res.status(500).json({ error: 'Erro ao buscar posição do jogador.' });
  }
}
