import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { palworldApiClient, getPlayersFromAPI, getServerInfo } from '@/services/palworldApiClient';

import type { Player } from '@/types/palworld';


export async function GET(req: NextRequest) {
  try {
    // Tentar buscar da API do PalDefender primeiro
    const apiPlayers = await getPlayersFromAPI();
    const serverInfo = await getServerInfo();

    if (Array.isArray(apiPlayers) && apiPlayers.length > 0) {
      // Formatar dados da API real
      const formattedPlayers = apiPlayers.map((player: any) => ({
        id: player.steamId || player.steamid || player.id,
        name: player.name,
        steamId: player.steamId || player.steamid,
        x: player.x || 0,
        y: player.y || 0,
        z: player.z || 0,
        level: player.level || 1,
        server: (serverInfo as any)?.name || 'Servidor Palworld',
        online: true
      }));

      return NextResponse.json({
        players: formattedPlayers,
        serverInfo: serverInfo,
        count: formattedPlayers.length,
        source: 'api'
      });
    }

    // Fallback para API antiga se não conseguir da nova
    const { data } = await palworldApiClient.get<{ players: Player[] }>('/players');
    return NextResponse.json({
      players: data.players,
      count: data.players.length,
      source: 'fallback'
    });
  } catch (error: any) {
    console.error('Erro ao buscar jogadores:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao buscar jogadores.',
      players: [],
      count: 0
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Endpoint para sincronização manual
    const players = await getPlayersFromAPI();
    const serverInfo = await getServerInfo();

    const syncedCount = Array.isArray(players) ? players.length : 0;

    return NextResponse.json({
      message: `Sincronização realizada com sucesso! ${syncedCount} jogadores encontrados.`,
      syncedCount: syncedCount,
      players: players,
      serverInfo: serverInfo
    });
  } catch (error: any) {
    console.error('Erro na sincronização:', error);
    return NextResponse.json(
      { error: 'Erro na sincronização: ' + error.message },
      { status: 500 }
    );
  }
}
