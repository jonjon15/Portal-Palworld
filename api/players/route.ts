import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { palworldApiClient } from '@/services/palworldApiClient';

import type { Player } from '@/types/palworld';


export async function GET(req: NextRequest) {
  try {
    const { data } = await palworldApiClient.get<{ players: Player[] }>('/players');
    // Retornar apenas jogadores online e coordenadas se disponíveis
    return NextResponse.json({ players: data.players });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao buscar jogadores.' }, { status: 500 });
  }
}
