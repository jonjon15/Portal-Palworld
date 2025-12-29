// Cliente para consumir endpoints de mapa da API oficial do Palworld
// https://docs.palworldgame.com/category/rest-api

const API_BASE = "https://api.palworldgame.com";

export async function getMapData() {
  const res = await fetch(`${API_BASE}/map`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar dados do mapa");
  return res.json();
}
