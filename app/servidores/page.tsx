import React from "react";
import { getServers } from "../../services/palworldServersApiClient";

export default async function ServidoresPage() {
  let servers: any[] = [];
  let error = "";
  try {
    servers = await getServers();
  } catch (e: any) {
    error = e.message || "Erro ao buscar servidores.";
  }
  return (
    <div className="container" style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>Meus Servidores</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {servers.length === 0 && !error && <p>Nenhum servidor encontrado.</p>}
      {servers.length > 0 && (
        <table className="table table-dark table-striped mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Status</th>
              <th>Jogadores Online</th>
            </tr>
          </thead>
          <tbody>
            {servers.map((s: any) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.status}</td>
                <td>{s.onlinePlayers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
