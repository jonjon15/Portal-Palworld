import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getServers } from '../../services/palworldServersApiClient';

export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  description?: string;
  version?: string;
  players?: number;
  maxPlayers?: number;
  status?: string;
}

export async function GET(req: NextRequest) {
  try {
    const servers = await getServers();

    // Transformar dados da API oficial para nosso formato
    const formattedServers: Server[] = servers.map((server: any, index: number) => ({
      id: server.id || `server-${index + 1}`,
      name: server.name || `Servidor ${index + 1}`,
      host: server.host || '127.0.0.1',
      port: server.port || 8211,
      description: server.description,
      version: server.version,
      players: server.players || 0,
      maxPlayers: server.maxPlayers || 32,
      status: server.status || 'online'
    }));

    return NextResponse.json(formattedServers);
  } catch (error: any) {
    console.error('Erro ao buscar servidores:', error);

    // Fallback com dados do nosso servidor conhecido
    const fallbackServers: Server[] = [
      {
        id: 'paldefender-1',
        name: 'PalDefender Server',
        host: '201.93.248.252',
        port: 8212,
        description: 'Servidor principal Palworld',
        version: '1.0.0',
        players: 0,
        maxPlayers: 32,
        status: 'online'
      }
    ];

    return NextResponse.json(fallbackServers);
  }
}