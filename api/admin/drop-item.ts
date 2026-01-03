import { prisma } from '../../lib/prisma';
import { verifyToken } from '../../lib/jwt';
import { applyCorsNode } from '../../lib/cors';
import { sendRconCommand } from '../../services/rconClient';
import { getPlayersFromAPI, giveItemToPlayer } from '../../services/palworldApiClient';

function looksLikeCommandFailure(response: string): boolean {
  const r = (response || '').toLowerCase();
  if (!r) return false; // alguns servidores retornam vazio mesmo em sucesso
  return (
    r.includes('unknown command') ||
    r.includes('not found') ||
    r.includes('invalid') ||
    r.includes('usage:') ||
    r.includes('error')
  );
}

function getAdminUsernames(): string[] {
  const raw = process.env.ADMIN_USERNAMES || '';
  return raw.split(',').map(s => s.trim()).filter(Boolean).map(s => s.toLowerCase());
}

export default async function handler(req: any, res: any) {
  const cors = applyCorsNode(req, res);
  if (cors.blocked) return;

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const adminUsernames = getAdminUsernames();
  if (adminUsernames.length === 0) {
    return res.status(403).json({ error: 'Admin não configurado' });
  }

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Token inválido' });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { username: true }
    });

    if (!user || !adminUsernames.includes(user.username.toLowerCase())) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { playerUserId, item, quantity } = body;

    if (!playerUserId || !item || !quantity) {
      return res.status(400).json({ error: 'Faltam parâmetros (playerUserId, item, quantity)' });
    }

    // Tentar usar API REST primeiro
    try {
      const apiResult = await giveItemToPlayer(playerUserId, item, quantity);
      return res.status(200).json({
        ok: true,
        message: `Item ${item} x${quantity} enviado para ${playerUserId}`,
        method: apiResult.method,
        response: apiResult.data
      });
    } catch (apiError) {
      // Se API falhar, usar RCON como fallback
      const apiErrorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      console.log('API falhou, usando RCON:', apiErrorMessage);
      
      try {
        // Muitos mods/servidores aceitam /give por playerId (AA7C...) e não por steam_...
        const targetIds: string[] = [playerUserId];
        try {
          const players = await getPlayersFromAPI();
          const match = players.find((p: any) => {
            const uid = (p.userId || p.steamid || p.playeruid || '').toString();
            return uid && uid === playerUserId;
          });
          if (match) {
            const candidates = [match.playerId, match.playeruid, match.name, match.accountName, match.userId, match.steamid]
              .map((v: any) => (v || '').toString().trim())
              .filter(Boolean);
            for (const c of candidates) {
              if (!targetIds.includes(c)) targetIds.push(c);
            }
            console.log('RCON fallback: identificadores do jogador encontrados via /v1/api/players:', targetIds);
          } else {
            console.log('RCON fallback: jogador não encontrado na lista /v1/api/players; usando apenas playerUserId');
          }
        } catch (e) {
          console.log('RCON fallback: falha ao consultar /v1/api/players (seguindo sem playerId):', e instanceof Error ? e.message : String(e));
        }

        // Tentar diferentes formatos de comando RCON para Palworld
        // Prioriza giveitemmod (GiveItemMod v2/v5 registram isso via RegisterConsoleCommandGlobalHandler)
        const commands: string[] = [];
        const targetNames = targetIds.filter((v) => !v.startsWith('steam_') && /^[A-Za-z0-9_\-]{2,32}$/.test(v));
        for (const name of targetNames) {
          commands.push(`giveitemmod ${name} ${item} ${quantity}`);
          commands.push(`/giveitemmod ${name} ${item} ${quantity}`);
        }

        // Depois tenta /give (variações)
        for (const id of targetIds) {
          // formato mais comum
          commands.push(`/give ${id} ${item} ${quantity}`);
          commands.push(`give ${id} ${item} ${quantity}`);

          // algumas variações (ordem invertida)
          commands.push(`/give ${item} ${quantity} ${id}`);
          commands.push(`give ${item} ${quantity} ${id}`);
        }
        for (const id of targetIds) {
          commands.push(`GiveItem ${id} ${item} ${quantity}`);
          commands.push(`GiveItemToPlayer ${id} ${item} ${quantity}`);
          commands.push(`/GiveItem ${id} ${item} ${quantity}`);
          commands.push(`/GiveItemToPlayer ${id} ${item} ${quantity}`);
          commands.push(`giveitem ${id} ${item} ${quantity}`);
        }

        const attempts: Array<{ command: string; ok: boolean; response?: string; error?: string }> = [];
        let lastError: any;
        for (const command of commands) {
          try {
            console.log(`Tentando comando RCON: ${command}`);
            const response = await sendRconCommand(command);

            // Se o servidor respondeu com algo que parece falha, continua tentando
            if (looksLikeCommandFailure(response)) {
              attempts.push({ command, ok: false, response });
              console.log(`Resposta indica falha para "${command}":`, response);
              continue;
            }

            attempts.push({ command, ok: true, response });
            
            return res.status(200).json({
              ok: true,
              message: `Item ${item} x${quantity} enviado via RCON para ${playerUserId}`,
              command,
              response,
              method: 'rcon_fallback',
              apiError: apiErrorMessage
            });
          } catch (err) {
            lastError = err;
            attempts.push({
              command,
              ok: false,
              error: err instanceof Error ? err.message : String(err)
            });
            console.log(`Comando "${command}" falhou, tentando próximo...`, err instanceof Error ? err.message : String(err));
          }
        }

        // Se todos os comandos falharam
        throw lastError || new Error('Todos os comandos RCON falharam');

      } catch (rconError) {
        console.error('RCON também falhou:', rconError);
        return res.status(500).json({
          error: 'Falha ao enviar item via API e RCON',
          details: rconError instanceof Error ? rconError.message : 'Erro desconhecido',
          apiError: apiErrorMessage
        });
      }
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro';
    console.error('Erro drop-item:', error);
    return res.status(500).json({ error: message });
  }
}
