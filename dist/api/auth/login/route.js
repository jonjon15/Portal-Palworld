"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const { PrismaClient } = require('../../../src/generated/client');
const prisma = new PrismaClient();
async function POST(request) {
    const prisma = new PrismaClient();
    try {
        const body = await request.json();
        const { username, password } = body;
        if (!username || !password) {
            return server_1.NextResponse.json({ error: 'Usuário e senha são obrigatórios.' }, {
                status: 400,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });
        }
        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            return server_1.NextResponse.json({ error: 'Usuário ou senha inválidos.' }, {
                status: 401,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });
        }
        // Verificar senha
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return server_1.NextResponse.json({ error: 'Usuário ou senha inválidos.' }, {
                status: 401,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });
        }
        // Aqui você pode gerar um token JWT ou usar sessões
        // Por simplicidade, retornamos sucesso e o userId
        return server_1.NextResponse.json({ message: 'Login bem-sucedido.', userId: user.id }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    }
    catch (error) {
        console.error('Erro ao fazer login:', error);
        return server_1.NextResponse.json({ error: 'Erro interno do servidor.' }, {
            status: 500,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    }
    finally {
        await prisma.$disconnect();
    }
}
