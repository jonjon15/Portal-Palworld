export interface ServerInfo {
  serverName: string;
  // ...outros campos conforme resposta da API
}

export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  description?: string;
  version?: string;
  players?: number;
  maxPlayers?: number;
  status?: string;
}

export interface Player {
  id: number;
  name: string;
  x: number;
  y: number;
  z: number;
  steam_id?: string;
}
