"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const rconClient_1 = require("@/services/rconClient");
async function POST(req) {
    try {
        const { palId, quantity, coordinates } = await req.json();
        if (!palId || typeof palId !== 'string' || !quantity || typeof quantity !== 'number' || !coordinates || typeof coordinates.x !== 'number' || typeof coordinates.y !== 'number' || typeof coordinates.z !== 'number') {
            return server_1.NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
        }
        // Comando RCON real deve ser ajustado conforme sintaxe do Palworld
        const command = `SpawnPal ${palId} ${quantity} ${coordinates.x} ${coordinates.y} ${coordinates.z}`;
        const result = await (0, rconClient_1.sendRconCommand)(command);
        return server_1.NextResponse.json({ result });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: error.message || 'Erro ao executar comando RCON.' }, { status: 500 });
    }
}
