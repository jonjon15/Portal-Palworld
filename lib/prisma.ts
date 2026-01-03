import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  var prisma: PrismaClient | undefined;
  var pgPool: Pool | undefined;
}

const DATABASE_URL = process.env.DATABASE_URL;

function createMissingDatabaseUrlPrisma(): PrismaClient {
  const err = new Error('DATABASE_URL não está definido nas variáveis de ambiente.');
  return new Proxy({} as PrismaClient, {
    get() {
      throw err;
    },
  });
}

const pool =
  DATABASE_URL
    ? global.pgPool ||
      new Pool({
        connectionString: DATABASE_URL,
        max: 5,
      })
    : null;

if (pool && process.env.NODE_ENV !== 'production') {
  global.pgPool = pool;
}

export const prisma =
  (pool
    ? global.prisma ||
      new PrismaClient({
        adapter: new PrismaPg(pool),
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
    : createMissingDatabaseUrlPrisma());

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
