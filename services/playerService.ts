import { sendRconCommand } from './rconClient';
import { findApiPlayerByName, PalworldApiPlayer } from './palworldApiClient';

export interface PlayerInfo {
  name: string;
  playeruid: string;
  steamid: string;
  level?: number;
  x?: number;
  y?: number;
  z?: number;
}

function mapApiPlayerToPlayerInfo(player: PalworldApiPlayer): PlayerInfo {
  const name = player.name || player.accountName || 'Jogador Desconhecido';
  const playeruid = player.playerId || player.playeruid || player.userId || 'unknown';
  const steamid = player.userId || player.steamid || 'unknown';

  return {
    name,
    playeruid,
    steamid,
    level: player.level ?? 1,
    x: player.location_x ?? 0,
    y: player.location_y ?? 0,
    z: player.location_z ?? 0,
  };
}

export async function getOnlinePlayers(): Promise<PlayerInfo[]> {
  try {
    const response = await sendRconCommand('ShowPlayers');
    const lines = response.split('\n').filter(line => line.trim());
    if (lines.length <= 1) return [];

    const players: PlayerInfo[] = [];
    for (let i = 1; i < lines.length; i++) {
      const [name, playeruid, steamid] = lines[i].split(',');
      if (name && playeruid && steamid) {
        players.push({ name: name.trim(), playeruid: playeruid.trim(), steamid: steamid.trim() });
      }
    }
    return players;
  } catch (error) {
    console.error('Erro ao buscar jogadores online:', error);
    return [];
  }
}

export async function findPlayerByName(playerName: string): Promise<PlayerInfo | null> {
  const players = await getOnlinePlayers();
  return players.find(p => p.name.toLowerCase() === playerName.toLowerCase()) || null;
}

export async function getPlayerInfo(playerName: string): Promise<PlayerInfo | null> {
  try {
    const apiPlayer = await findApiPlayerByName(playerName);
    if (apiPlayer) {
      return mapApiPlayerToPlayerInfo(apiPlayer);
    }
  } catch (error) {
    console.warn('Falha API, tentando RCON:', error);
  }

  const player = await findPlayerByName(playerName);
  if (!player) return null;

  return {
    ...player,
    level: 1,
    x: 0,
    y: 0,
    z: 0,
  };
}

export async function getPlayerInfoStrict(playerName: string): Promise<PlayerInfo | null> {
  const apiPlayer = await findApiPlayerByName(playerName);
  return apiPlayer ? mapApiPlayerToPlayerInfo(apiPlayer) : null;
}

export async function playerExists(playerName: string): Promise<boolean> {
  const info = await getPlayerInfo(playerName);
  return info !== null;
}
