import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { loginSchema } from '../../lib/validations';
import { generateToken } from '../../lib/jwt';
import { applyCorsNode } from '../../lib/cors';

const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export default async function handler(req: any, res: any) {
  // Configurar CORS (restrito por env)
  const cors = applyCorsNode(req, res);
  if (cors.blocked) return;

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // Validar dados de entrada
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return res.status(400).json({
        error: validation.error.issues[0].message,
      });
    }

    const { username, password } = validation.data;

    // Buscar usuário com jogador associado
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        player: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    return res.status(200).json({
      message: 'Login bem-sucedido.',
      userId: user.id,
      username: user.username,
      playerName: user.player?.name,
      playerId: user.player?.id,
      token,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
