// Cliente para consumir a API oficial do Palworld
// https://docs.palworldgame.com/category/rest-api

const API_BASE = "https://api.palworldgame.com";

export async function getPlayers() {
  const res = await fetch(`${API_BASE}/players`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar jogadores");
  return res.json();
}

export async function getPlayerById(id: string) {
  const res = await fetch(`${API_BASE}/players/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar jogador");
  return res.json();
}

// Adicione outros métodos conforme a doc oficial
