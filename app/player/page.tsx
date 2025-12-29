import React from "react";
import { getPlayers } from "../../services/palworldOfficialApiClient";

export default async function PlayerPage() {
  let players: any[] = [];
  let error = "";
  try {
    players = await getPlayers();
  } catch (e: any) {
    error = e.message || "Erro ao buscar jogadores.";
  }
  return (
    <div className="container" style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>Jogadores</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {players.length === 0 && !error && <p>Nenhum jogador encontrado.</p>}
      {players.length > 0 && (
        <table className="table table-dark table-striped mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Nível</th>
              <th>Experiência</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p: any) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.level}</td>
                <td>{p.experience}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
