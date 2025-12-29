import { NextRequest, NextResponse } from 'next/server';
import { sendRconCommand } from '../../services/rconClient';

export async function POST(request: NextRequest) {
  const { command } = await request.json();
  try {
    const response = await sendRconCommand(command);
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}