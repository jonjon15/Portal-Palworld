import { prisma } from '../../lib/prisma';
import { verifyToken } from '../../lib/jwt';
import { applyCorsNode } from '../../lib/cors';

function getAdminUsernames(): string[] {
  const raw = process.env.ADMIN_USERNAMES || '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

export default async function handler(req: any, res: any) {
  const cors = applyCorsNode(req, res);
  if (cors.blocked) return;

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminUsernames = getAdminUsernames();
  if (adminUsernames.length === 0) {
    return res.status(403).json({ error: 'Acesso admin não configurado (defina ADMIN_USERNAMES).' });
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
      select: { id: true, username: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const isAdmin = adminUsernames.includes(user.username.toLowerCase());
    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    return res.status(200).json({ ok: true, username: user.username, userId: user.id });
  } catch (error) {
    console.error('Erro ao checar admin:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
