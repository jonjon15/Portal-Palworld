"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const palworldApiClient_1 = require("@/services/palworldApiClient");
async function GET(req) {
    try {
        // Tentar buscar da API do PalDefender primeiro
        const apiPlayers = await (0, palworldApiClient_1.getPlayersFromAPI)();
        const serverInfo = await (0, palworldApiClient_1.getServerInfo)();
        if (Array.isArray(apiPlayers) && apiPlayers.length > 0) {
            // Formatar dados da API real
            const formattedPlayers = apiPlayers.map((player) => ({
                id: player.steamId || player.steamid || player.id,
                name: player.name,
                steamId: player.steamId || player.steamid,
                x: player.x || 0,
                y: player.y || 0,
                z: player.z || 0,
                level: player.level || 1,
                server: serverInfo?.name || 'Servidor Palworld',
                online: true
            }));
            return server_1.NextResponse.json({
                players: formattedPlayers,
                serverInfo: serverInfo,
                count: formattedPlayers.length,
                source: 'api'
            });
        }
        // Fallback para API antiga se não conseguir da nova
        const { data } = await palworldApiClient_1.palworldApiClient.get('/players');
        return server_1.NextResponse.json({
            players: data.players,
            count: data.players.length,
            source: 'fallback'
        });
    }
    catch (error) {
        console.error('Erro ao buscar jogadores:', error);
        return server_1.NextResponse.json({
            error: error.message || 'Erro ao buscar jogadores.',
            players: [],
            count: 0
        }, { status: 500 });
    }
}
async function POST(request) {
    try {
        // Endpoint para sincronização manual
        const players = await (0, palworldApiClient_1.getPlayersFromAPI)();
        const serverInfo = await (0, palworldApiClient_1.getServerInfo)();
        const syncedCount = Array.isArray(players) ? players.length : 0;
        return server_1.NextResponse.json({
            message: `Sincronização realizada com sucesso! ${syncedCount} jogadores encontrados.`,
            syncedCount: syncedCount,
            players: players,
            serverInfo: serverInfo
        });
    }
    catch (error) {
        console.error('Erro na sincronização:', error);
        return server_1.NextResponse.json({ error: 'Erro na sincronização: ' + error.message }, { status: 500 });
    }
}
