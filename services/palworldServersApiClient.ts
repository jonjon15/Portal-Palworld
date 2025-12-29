// Cliente para consumir endpoints de servidores da API oficial do Palworld
// https://docs.palworldgame.com/category/rest-api

const API_BASE = "https://api.palworldgame.com";

export async function getServers() {
  const res = await fetch(`${API_BASE}/servers`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar servidores");
  return res.json();
}

export async function getServerById(id: string) {
  const res = await fetch(`${API_BASE}/servers/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar servidor");
  return res.json();
}
