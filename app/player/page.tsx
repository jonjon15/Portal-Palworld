"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Player {
  id: number;
  name: string;
  steam_id: string;
  localizacao_x: number;
  localizacao_y: number;
  localizacao_z: number;
}

export default function PlayerPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [form, setForm] = useState({ name: "", steam_id: "", localizacao_x: 0, localizacao_y: 0, localizacao_z: 0 });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("palworld_auth")) {
      router.push("/login");
    }
    fetchPlayers();
  }, [router]);

  const fetchPlayers = async () => {
    // Simulação - em produção, buscar do banco/API
    const mockPlayers: Player[] = [
      { id: 1, name: "Player1", steam_id: "123456", localizacao_x: 100, localizacao_y: 200, localizacao_z: 0 },
      { id: 2, name: "Player2", steam_id: "654321", localizacao_x: 150, localizacao_y: 250, localizacao_z: 0 },
    ];
    setPlayers(mockPlayers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de add/edit
    if (editing) {
      setPlayers(players.map(p => p.id === editing.id ? { ...p, ...form } : p));
    } else {
      const newPlayer: Player = { id: Date.now(), ...form };
      setPlayers([...players, newPlayer]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", steam_id: "", localizacao_x: 0, localizacao_y: 0, localizacao_z: 0 });
  };

  const handleEdit = (player: Player) => {
    setEditing(player);
    setForm({ name: player.name, steam_id: player.steam_id, localizacao_x: player.localizacao_x, localizacao_y: player.localizacao_y, localizacao_z: player.localizacao_z });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const syncPlayers = async () => {
    // Simulação de sync via RCON/API
    alert("Jogadores sincronizados!");
    fetchPlayers();
  };

  return (
    <div className="container" style={{ maxWidth: 1000, margin: "40px auto" }}>
      <h2>Jogadores</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>Adicionar Jogador</button>
      <button className="btn btn-secondary mb-3 ms-2" onClick={syncPlayers}>Sincronizar Jogadores</button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 border">
          <div className="row">
            <div className="col-md-6">
              <label>Nome</label>
              <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label>Steam ID</label>
              <input type="text" className="form-control" value={form.steam_id} onChange={e => setForm({ ...form, steam_id: e.target.value })} />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-4">
              <label>X</label>
              <input type="number" className="form-control" value={form.localizacao_x} onChange={e => setForm({ ...form, localizacao_x: Number(e.target.value) })} />
            </div>
            <div className="col-md-4">
              <label>Y</label>
              <input type="number" className="form-control" value={form.localizacao_y} onChange={e => setForm({ ...form, localizacao_y: Number(e.target.value) })} />
            </div>
            <div className="col-md-4">
              <label>Z</label>
              <input type="number" className="form-control" value={form.localizacao_z} onChange={e => setForm({ ...form, localizacao_z: Number(e.target.value) })} />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-2">{editing ? "Atualizar" : "Adicionar"}</button>
          <button type="button" className="btn btn-secondary mt-2 ms-2" onClick={() => { setShowForm(false); setEditing(null); }}>Cancelar</button>
        </form>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Steam ID</th>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.steam_id}</td>
              <td>{player.localizacao_x}</td>
              <td>{player.localizacao_y}</td>
              <td>{player.localizacao_z}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(player)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(player.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
