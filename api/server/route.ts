import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { palworldApiClient, getServerInfo } from '../../services/palworldApiClient';
import type { ServerInfo } from '../../types/palworld';

export async function GET(req: NextRequest) {
  try {
    // Tentar buscar informações detalhadas da API
    const serverInfo = await getServerInfo();

    if (serverInfo) {
      return NextResponse.json({
        serverName: (serverInfo as any).name || 'Servidor Palworld',
        serverInfo: serverInfo,
        source: 'api'
      });
    }

    // Fallback para API antiga
    const { data } = await palworldApiClient.get<ServerInfo>('/server/info');
    return NextResponse.json({
      serverName: data.serverName,
      serverInfo: data,
      source: 'fallback'
    });
  } catch (error: any) {
    console.error('Erro ao buscar informações do servidor:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao buscar informações do servidor.',
      serverName: 'Servidor Palworld'
    }, { status: 500 });
  }
}
