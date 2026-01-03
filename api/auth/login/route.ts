import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { loginSchema } from '../../../lib/validations';
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
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400, headers: { ...noCacheHeaders, ...cors.headers } }
      );
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
      return NextResponse.json(
        { error: 'Usuário ou senha inválidos.' },
        { status: 401, headers: { ...noCacheHeaders, ...cors.headers } }
      );
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Usuário ou senha inválidos.' },
        { status: 401, headers: { ...noCacheHeaders, ...cors.headers } }
      );
    }

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    return NextResponse.json(
      {
        message: 'Login bem-sucedido.',
        userId: user.id,
        username: user.username,
        playerName: user.player?.name,
        playerId: user.player?.id,
        token,
      },
      { status: 200, headers: { ...noCacheHeaders, ...cors.headers } }
    );
  } catch (error) {
    console.error('Erro ao fazer login:', error);
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