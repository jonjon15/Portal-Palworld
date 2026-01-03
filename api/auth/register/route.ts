import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { registerSchema } from '../../../lib/validations';
import { generateToken } from '../../../lib/jwt';
import { getCorsHeadersForNext } from '../../../lib/cors';

const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function POST(request: NextRequest) {
  try {
    const cors = getCorsHeadersForNext(request);
    if (cors.blocked) {
      return NextResponse.json({ error: 'Origin não permitido (CORS).' }, { status: 403, headers: cors.headers });
    }

    const body = await request.json();

    // Validar dados de entrada
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400, headers: { ...noCacheHeaders, ...cors.headers } }
      );
    }

    const { username, password, playerName } = validation.data;

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
      return NextResponse.json(
        { error: 'Usuário já existe.' },
        { status: 400, headers: { ...noCacheHeaders, ...cors.headers } }
      );
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

    return NextResponse.json(
      {
        message: 'Usuário e jogador criados com sucesso.',
        userId: user.id,
        playerName: user.player?.name,
        token,
      },
      { status: 201, headers: { ...noCacheHeaders, ...cors.headers } }
    );
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const cors = getCorsHeadersForNext(request);
  if (cors.blocked) {
    return NextResponse.json({ error: 'Origin não permitido (CORS).' }, { status: 403, headers: cors.headers });
  }
  return new NextResponse(null, { status: 204, headers: cors.headers });
}