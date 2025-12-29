import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
const { PrismaClient } = require('../../../src/generated/client');

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuário e senha são obrigatórios.' }, { 
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
      return NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { 
        status: 401,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { 
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
    return NextResponse.json({ message: 'Login bem-sucedido.', userId: user.id }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}