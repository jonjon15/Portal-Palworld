import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
const { PrismaClient } = require('../../../src/generated/client');

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const { username, password } = await request.json();

    console.log('Tentando registrar usuário:', username);

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuário e senha são obrigatórios.' }, { status: 400 });
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      console.log('Usuário já existe:', username);
      return NextResponse.json({ error: 'Usuário já existe.' }, { status: 400 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    console.log('Usuário criado com sucesso:', user.id);
    return NextResponse.json({ message: 'Usuário criado com sucesso.', userId: user.id }, { status: 201 });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}