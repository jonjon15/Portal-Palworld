"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.OPTIONS = OPTIONS;
const server_1 = require("next/server");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../../lib/prisma");
const validations_1 = require("../../../lib/validations");
const jwt_1 = require("../../../lib/jwt");
const cors_1 = require("../../../lib/cors");
const noCacheHeaders = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
};
async function POST(request) {
    try {
        const cors = (0, cors_1.getCorsHeadersForNext)(request);
        if (cors.blocked) {
            return server_1.NextResponse.json({ error: 'Origin não permitido (CORS).' }, { status: 403, headers: cors.headers });
        }
        const body = await request.json();
        // Validar dados de entrada
        const validation = validations_1.loginSchema.safeParse(body);
        if (!validation.success) {
            return server_1.NextResponse.json({ error: validation.error.issues[0].message }, { status: 400, headers: { ...noCacheHeaders, ...cors.headers } });
        }
        const { username, password } = validation.data;
        // Buscar usuário com jogador associado
        const user = await prisma_1.prisma.user.findUnique({
            where: { username },
            include: {
                player: true,
            },
        });
        if (!user) {
            return server_1.NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { status: 401, headers: { ...noCacheHeaders, ...cors.headers } });
        }
        // Verificar senha
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return server_1.NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { status: 401, headers: { ...noCacheHeaders, ...cors.headers } });
        }
        // Gerar token JWT
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            username: user.username,
        });
        return server_1.NextResponse.json({
            message: 'Login bem-sucedido.',
            userId: user.id,
            username: user.username,
            playerName: user.player?.name,
            playerId: user.player?.id,
            token,
        }, { status: 200, headers: { ...noCacheHeaders, ...cors.headers } });
    }
    catch (error) {
        console.error('Erro ao fazer login:', error);
        return server_1.NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500, headers: noCacheHeaders });
    }
}
async function OPTIONS(request) {
    const cors = (0, cors_1.getCorsHeadersForNext)(request);
    if (cors.blocked) {
        return server_1.NextResponse.json({ error: 'Origin não permitido (CORS).' }, { status: 403, headers: cors.headers });
    }
    return new server_1.NextResponse(null, { status: 204, headers: cors.headers });
}
