import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getPlayerInfo } from '../../../services/playerService';
import { verifyToken } from '../../../lib/jwt';

const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

/**
 * Sincroniza dados do jogador com o servidor Palworld
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido.' },
        { status: 401, headers: noCacheHeaders }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado.' },
        { status: 401, headers: noCacheHeaders }
      );
    }

    // Buscar usuário e jogador
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { player: true },
    });

    if (!user || !user.player) {
      return NextResponse.json(
        { error: 'Usuário ou jogador não encontrado.' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    // Buscar dados atualizados do servidor
    const playerInfo = await getPlayerInfo(user.player.name);

    if (!playerInfo) {
      return NextResponse.json(
        { error: 'Jogador não está online no servidor.' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    // Atualizar dados do jogador
    const updatedPlayer = await prisma.player.update({
      where: { id: user.player.id },
      data: {
        level: playerInfo.level || user.player.level,
        x: playerInfo.x || user.player.x,
        y: playerInfo.y || user.player.y,
        z: playerInfo.z || user.player.z,
      },
    });

    return NextResponse.json(
      {
        message: 'Dados sincronizados com sucesso.',
        player: {
          name: updatedPlayer.name,
          level: updatedPlayer.level,
          x: updatedPlayer.x,
          y: updatedPlayer.y,
          z: updatedPlayer.z,
        },
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error) {
    console.error('Erro ao sincronizar jogador:', error);
    return NextResponse.json(
      { error: 'Erro ao sincronizar dados do jogador.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
