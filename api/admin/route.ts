import { NextRequest, NextResponse } from 'next/server';
import { sendRconCommand } from '../../services/rconClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, message, steamId, x, y, z, palName, level } = body;

    let command = '';
    let description = '';

    switch (action) {
      case 'broadcast':
        if (!message) {
          return NextResponse.json({ error: 'Mensagem obrigatória para broadcast' }, { status: 400 });
        }
        command = `Broadcast ${message}`;
        description = `Broadcast: ${message}`;
        break;

      case 'kick':
        if (!steamId) {
          return NextResponse.json({ error: 'SteamID obrigatório para kick' }, { status: 400 });
        }
        command = `KickPlayer ${steamId}`;
        description = `Kick player: ${steamId}`;
        break;

      case 'ban':
        if (!steamId) {
          return NextResponse.json({ error: 'SteamID obrigatório para ban' }, { status: 400 });
        }
        command = `BanPlayer ${steamId}`;
        description = `Ban player: ${steamId}`;
        break;

      case 'teleport':
        if (!steamId || x === undefined || y === undefined || z === undefined) {
          return NextResponse.json({ error: 'SteamID e coordenadas obrigatórios para teleport' }, { status: 400 });
        }
        command = `TeleportPlayer ${steamId} ${x} ${y} ${z}`;
        description = `Teleport player ${steamId} to (${x}, ${y}, ${z})`;
        break;

      case 'summon':
        if (!palName || x === undefined || y === undefined || z === undefined) {
          return NextResponse.json({ error: 'Nome do Pal e coordenadas obrigatórios' }, { status: 400 });
        }
        const summonLevel = level || 1;
        command = `SpawnPal ${palName} ${x} ${y} ${z} ${summonLevel}`;
        description = `Summon ${palName} (Lv.${summonLevel}) at (${x}, ${y}, ${z})`;
        break;

      case 'custom':
        if (!body.command) {
          return NextResponse.json({ error: 'Comando obrigatório' }, { status: 400 });
        }
        command = body.command;
        description = `Custom command: ${command}`;
        break;

      default:
        return NextResponse.json({ error: 'Ação não suportada' }, { status: 400 });
    }

    const response = await sendRconCommand(command);

    return NextResponse.json({
      success: true,
      response,
      command,
      description,
      action
    });

  } catch (error: any) {
    console.error('Erro no comando RCON:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao executar comando RCON',
      success: false
    }, { status: 500 });
  }
}