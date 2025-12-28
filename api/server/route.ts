import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { palworldApiClient } from '@/services/palworldApiClient';

export async function GET(req: NextRequest) {
  try {
    const { data } = await palworldApiClient.get('/server/info');
    // Retornar apenas o nome do servidor
    return NextResponse.json({ serverName: data.serverName });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao buscar informações do servidor.' }, { status: 500 });
  }
}
