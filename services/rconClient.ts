import { Rcon } from 'rcon-client';

function normalizeHost(value: string): string {
  const trimmed = value.trim().replace(/^['\"]+|['\"]+$/g, '');
  // RCON precisa de host puro (sem http/https) e sem path
  const noProto = trimmed.replace(/^https?:\/\//i, '');
  return noProto.split('/')[0].trim();
}

const RCON_HOST = normalizeHost(process.env.RCON_HOST || '201.93.248.252');
const RCON_PORT = process.env.RCON_PORT ? Number(String(process.env.RCON_PORT).trim()) : 25575;
const RCON_PASSWORD = (process.env.RCON_PASSWORD || '').trim().replace(/^['\"]+|['\"]+$/g, '');

function getTimeoutMs(): number {
  const raw = process.env.RCON_TIMEOUT_MS;
  const parsed = raw ? Number(String(raw).trim()) : 8000;
  if (!Number.isFinite(parsed) || parsed <= 0) return 8000;
  return parsed;
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => reject(new Error(`Timeout (${label}) após ${ms}ms`)), ms);
    });
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function sendRconCommand(command: string): Promise<string> {
  if (!RCON_HOST || !RCON_PASSWORD) {
    throw new Error('RCON_HOST/RCON_PASSWORD não estão definidos nas variáveis de ambiente.');
  }

  if (!Number.isFinite(RCON_PORT) || RCON_PORT <= 0) {
    throw new Error('RCON_PORT inválido.');
  }

  const timeoutMs = getTimeoutMs();
  
  const rcon = new Rcon({
    host: RCON_HOST,
    port: RCON_PORT,
    password: RCON_PASSWORD,
  });
  try {
    await withTimeout(rcon.connect(), timeoutMs, 'connect');
    const response = await withTimeout(rcon.send(command), timeoutMs, 'send');
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao conectar no RCON.';
    throw new Error(`Falha ao conectar no RCON (${RCON_HOST}:${RCON_PORT}): ${message}`);
  } finally {
    try {
      await withTimeout(rcon.end(), 1500, 'end');
    } catch {
      // ignora
    }
  }
}
