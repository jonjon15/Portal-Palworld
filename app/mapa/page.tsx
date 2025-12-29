import React from "react";
import { getMapData } from "../../services/palworldMapApiClient";

export default async function MapaPage() {
  let mapData: any = null;
  let error = "";
  try {
    mapData = await getMapData();
  } catch (e: any) {
    error = e.message || "Erro ao buscar dados do mapa.";
  }
  return (
    <div className="container" style={{ maxWidth: 1000, margin: "40px auto" }}>
      <h2>Mapa Interativo</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {!mapData && !error && <p>Nenhum dado de mapa encontrado.</p>}
      {mapData && (
        <pre style={{ background: "#222", color: "#fff", padding: 16, borderRadius: 8 }}>
          {JSON.stringify(mapData, null, 2)}
        </pre>
      )}
    </div>
  );
}
