import React from "react";
import { getMarketItems, getAuctions, getBlackMarket } from "../../services/palworldMarketplaceApiClient";

export default async function MarketplacePage() {
  let marketItems: any[] = [];
  let auctions: any[] = [];
  let blackMarket: any[] = [];
  let error = "";
  try {
    marketItems = await getMarketItems();
    auctions = await getAuctions();
    blackMarket = await getBlackMarket();
  } catch (e: any) {
    error = e.message || "Erro ao buscar dados do marketplace.";
  }
  return (
    <div className="container" style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>MarketPlace</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <h4 className="mt-4">Mercado</h4>
      {marketItems.length === 0 && <p>Nenhum item no mercado.</p>}
      {marketItems.length > 0 && (
        <table className="table table-dark table-striped">
          <thead>
            <tr><th>Item</th><th>Preço</th><th>Quantidade</th></tr>
          </thead>
          <tbody>
            {marketItems.map((item: any, i: number) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h4 className="mt-4">Leilão</h4>
      {auctions.length === 0 && <p>Nenhum leilão ativo.</p>}
      {auctions.length > 0 && (
        <table className="table table-dark table-striped">
          <thead>
            <tr><th>Item</th><th>Lance Atual</th><th>Tempo Restante</th></tr>
          </thead>
          <tbody>
            {auctions.map((a: any, i: number) => (
              <tr key={i}>
                <td>{a.itemName}</td>
                <td>{a.currentBid}</td>
                <td>{a.timeLeft}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h4 className="mt-4">Mercado Negro</h4>
      {blackMarket.length === 0 && <p>Nenhum item no mercado negro.</p>}
      {blackMarket.length > 0 && (
        <table className="table table-dark table-striped">
          <thead>
            <tr><th>Item</th><th>Preço</th><th>Quantidade</th></tr>
          </thead>
          <tbody>
            {blackMarket.map((item: any, i: number) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
