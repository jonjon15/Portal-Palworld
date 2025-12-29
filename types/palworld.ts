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
  name: string;
  x: number;
  y: number;
  z: number;
  // ...outros campos conforme resposta da API
}
