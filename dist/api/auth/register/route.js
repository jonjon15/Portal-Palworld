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
        console.log('Tentando conectar ao banco...');
        await prisma.$connect();
        console.log('Conectado ao banco com sucesso');
        const body = await request.json();
        const { username, password } = body;
        console.log('Tentando registrar usuário:', username);
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
        // Verificar se usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            console.log('Usuário já existe:', username);
            return server_1.NextResponse.json({ error: 'Usuário já existe.' }, {
                status: 400,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });
        }
        // Hash da senha
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Criar usuário
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        console.log('Usuário criado com sucesso:', user.id);
        return server_1.NextResponse.json({ message: 'Usuário criado com sucesso.', userId: user.id }, {
            status: 201,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    }
    catch (error) {
        console.error('Erro ao registrar usuário:', error);
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
