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
        const validation = validations_1.registerSchema.safeParse(body);
        if (!validation.success) {
            return server_1.NextResponse.json({ error: validation.error.issues[0].message }, { status: 400, headers: { ...noCacheHeaders, ...cors.headers } });
        }
        const { username, password, playerName } = validation.data;
        // Valores padrão para jogador
        let playerLevel = 1;
        let playerX = 0;
        let playerY = 0;
        let playerZ = 0;
        // Verificar se usuário já existe
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return server_1.NextResponse.json({ error: 'Usuário já existe.' }, { status: 400, headers: { ...noCacheHeaders, ...cors.headers } });
        }
        // Hash da senha
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Criar usuário com jogador vinculado
        const user = await prisma_1.prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                player: {
                    create: {
                        name: playerName,
                        level: playerLevel,
                        x: playerX,
                        y: playerY,
                        z: playerZ,
                    },
                },
            },
            include: {
                player: true,
            },
        });
        // Gerar token JWT
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            username: user.username,
        });
        return server_1.NextResponse.json({
            message: 'Usuário e jogador criados com sucesso.',
            userId: user.id,
            playerName: user.player?.name,
            token,
        }, { status: 201, headers: { ...noCacheHeaders, ...cors.headers } });
    }
    catch (error) {
        console.error('Erro ao registrar usuário:', error);
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
