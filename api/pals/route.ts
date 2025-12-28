import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { sendRconCommand } from '@/services/rconClient';

export async function POST(req: NextRequest) {
  try {
    const { palId, quantity, coordinates } = await req.json();
    if (!palId || typeof palId !== 'string' || !quantity || typeof quantity !== 'number' || !coordinates || typeof coordinates.x !== 'number' || typeof coordinates.y !== 'number' || typeof coordinates.z !== 'number') {
      return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
    }
    // Comando RCON real deve ser ajustado conforme sintaxe do Palworld
    const command = `SpawnPal ${palId} ${quantity} ${coordinates.x} ${coordinates.y} ${coordinates.z}`;
    const result = await sendRconCommand(command);
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao executar comando RCON.' }, { status: 500 });
  }
}
