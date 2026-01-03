import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { registerSchema } from '../../lib/validations';
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
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error);
      return res.status(400).setHeader('Cache-Control', noCacheHeaders['Cache-Control']).json({
        error: validation.error.issues[0].message,
      });
    }

    const { username, password, playerName } = validation.data;

    console.log(`Tentando registrar usuário: ${username}, jogador: ${playerName}`);

    // Valores padrão para jogador
    let playerLevel = 1;
    let playerX = 0;
    let playerY = 0;
    let playerZ = 0;

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe.' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário com jogador vinculado
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        player: {
          create: {
            name: playerName,
            level: playerLevel,
            x: playerX,
            y: playerY,
            z: playerZ,
          },
        },
      },
      include: {
        player: true,
      },
    });

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    return res.status(201).json({
      message: 'Usuário e jogador criados com sucesso.',
      userId: user.id,
      playerName: user.player?.name,
      token,
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Stack trace:', errorStack);
    return res.status(500).json({ 
      error: 'Erro interno do servidor.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}
