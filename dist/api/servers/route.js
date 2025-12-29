"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const palworldServersApiClient_1 = require("../../services/palworldServersApiClient");
async function GET(req) {
    try {
        const servers = await (0, palworldServersApiClient_1.getServers)();
        // Transformar dados da API oficial para nosso formato
        const formattedServers = servers.map((server, index) => ({
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
        return server_1.NextResponse.json(formattedServers);
    }
    catch (error) {
        console.error('Erro ao buscar servidores:', error);
        // Fallback com dados do nosso servidor conhecido
        const fallbackServers = [
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
        return server_1.NextResponse.json(fallbackServers);
    }
}
