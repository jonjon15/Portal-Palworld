"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const palworldApiClient_1 = require("../../services/palworldApiClient");
async function GET(req) {
    try {
        // Tentar buscar informações detalhadas da API
        const serverInfo = await (0, palworldApiClient_1.getServerInfo)();
        if (serverInfo) {
            return server_1.NextResponse.json({
                serverName: serverInfo.name || 'Servidor Palworld',
                serverInfo: serverInfo,
                source: 'api'
            });
        }
        // Fallback para API antiga
        const { data } = await palworldApiClient_1.palworldApiClient.get('/server/info');
        return server_1.NextResponse.json({
            serverName: data.serverName,
            serverInfo: data,
            source: 'fallback'
        });
    }
    catch (error) {
        console.error('Erro ao buscar informações do servidor:', error);
        return server_1.NextResponse.json({
            error: error.message || 'Erro ao buscar informações do servidor.',
            serverName: 'Servidor Palworld'
        }, { status: 500 });
    }
}
