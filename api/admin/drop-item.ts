import { prisma } from '../../lib/prisma';
import { verifyToken } from '../../lib/jwt';
import { applyCorsNode } from '../../lib/cors';
import { sendRconCommand } from '../../services/rconClient';
import { giveItemToPlayer } from '../../services/palworldApiClient';

function getAdminUsernames(): string[] {
  const raw = process.env.ADMIN_USERNAMES || '';
  return raw.split(',').map(s => s.trim()).filter(Boolean).map(s => s.toLowerCase());
}

export default async function handler(req: any, res: any) {
  const cors = applyCorsNode(req, res);
  if (cors.blocked) return;

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { username: true }
    });

    if (!user || !adminUsernames.includes(user.username.toLowerCase())) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { playerUserId, item, quantity } = body;

    if (!playerUserId || !item || !quantity) {
      return res.status(400).json({ error: 'Faltam parâmetros (playerUserId, item, quantity)' });
    }

    // Tentar usar API REST primeiro
    try {
      const apiResult = await giveItemToPlayer(playerUserId, item, quantity);
      return res.status(200).json({
        ok: true,
        message: `Item ${item} x${quantity} enviado para ${playerUserId}`,
        method: apiResult.method,
        response: apiResult.data
      });
    } catch (apiError) {
      // Se API falhar, usar RCON como fallback
      console.log('API falhou, usando RCON:', apiError);
      
      const command = `/give ${playerUserId} ${item} ${quantity}`;
      const response = await sendRconCommand(command);

      return res.status(200).json({
        ok: true,
        message: `Item ${item} x${quantity} enviado para ${playerUserId}`,
        command,
        response,
        method: 'rcon_fallback'
      });
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro';
    console.error('Erro drop-item:', error);
    return res.status(500).json({ error: message });
  }
}
