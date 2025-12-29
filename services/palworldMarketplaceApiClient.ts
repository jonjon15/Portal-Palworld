// Cliente para consumir endpoints de marketplace da API oficial do Palworld
// https://docs.palworldgame.com/category/rest-api

const API_BASE = "https://api.palworldgame.com";

export async function getMarketItems() {
  const res = await fetch(`${API_BASE}/market/items`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar itens do mercado");
  return res.json();
}

export async function getAuctions() {
  const res = await fetch(`${API_BASE}/market/auctions`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar leilões");
  return res.json();
}

export async function getBlackMarket() {
  const res = await fetch(`${API_BASE}/market/blackmarket`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar mercado negro");
  return res.json();
}
