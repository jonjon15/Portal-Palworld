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
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("palworld_auth")) {
      router.push("/login");
    }
    fetchPlayers();
  }, [router]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/players');
      const data = await response.json();

      if (response.ok && data.players) {
        // Converter dados da API para o formato esperado
        const formattedPlayers: Player[] = data.players.map((player: any, index: number) => ({
          id: player.id || index + 1,
          name: player.name || 'Unknown',
          steam_id: player.steamId || player.steam_id || '',
          localizacao_x: player.x || player.localizacao_x || 0,
          localizacao_y: player.y || player.localizacao_y || 0,
          localizacao_z: player.z || player.localizacao_z || 0,
        }));
        setPlayers(formattedPlayers);
      } else {
        console.error('Erro ao buscar jogadores:', data.error);
        // Fallback para dados vazios se API falhar
        setPlayers([]);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
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
    setSyncLoading(true);
    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}`);
        // Recarregar jogadores após sincronização
        fetchPlayers();
      } else {
        alert(`❌ Erro na sincronização: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      alert('❌ Erro ao sincronizar jogadores');
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 1000, margin: "40px auto" }}>
      <h2>👥 Gerenciamento de Jogadores</h2>
      <p className="text-muted">Gerencie jogadores do seu servidor Palworld</p>

      <div className="d-flex gap-2 mb-4">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          ➕ Adicionar Jogador
        </button>
        <button
          className="btn btn-success"
          onClick={syncPlayers}
          disabled={loading || syncLoading}
        >
          {syncLoading ? '🔄 Sincronizando...' : '🔄 Sincronizar da API'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={fetchPlayers}
          disabled={loading}
        >
          {loading ? '⏳ Carregando...' : '🔄 Atualizar Lista'}
        </button>
      </div>
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
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Lista de Jogadores ({players.length})</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-2">Carregando jogadores...</p>
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">Nenhum jogador encontrado.</p>
              <p className="text-muted small">Clique em "Sincronizar da API" para buscar jogadores do servidor.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Nome</th>
                    <th>Steam ID</th>
                    <th>Coordenadas</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map(player => (
                    <tr key={player.id}>
                      <td>{player.name}</td>
                      <td><code>{player.steam_id}</code></td>
                      <td>
                        <small className="text-muted">
                          X: {player.localizacao_x}<br />
                          Y: {player.localizacao_y}<br />
                          Z: {player.localizacao_z}
                        </small>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(player)}>✏️ Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(player.id)}>🗑️ Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
