"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  description?: string;
  version?: string;
  players?: number;
  maxPlayers?: number;
  status?: string;
}

export default function ServidoresPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Server | null>(null);
  const [form, setForm] = useState({ name: "", host: "", port: 8211 });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("palworld_auth")) {
      router.push("/login");
    }
    fetchServers();
  }, [router]);

  const fetchServers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/servers');
      if (!response.ok) {
        throw new Error('Erro ao buscar servidores');
      }
      const data = await response.json();
      setServers(data);
    } catch (error: any) {
      console.error('Erro ao buscar servidores:', error);
      setError(error.message || 'Erro ao carregar servidores');
      // Fallback para dados locais se a API falhar
      setServers([
        {
          id: 'fallback-1',
          name: 'Servidor Local',
          host: '127.0.0.1',
          port: 8211,
          description: 'Servidor de fallback',
          status: 'offline'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setServers(servers.map(s => s.id === editing.id ? { ...s, ...form } : s));
    } else {
      const newServer: Server = {
        id: `custom-${Date.now()}`,
        ...form,
        description: 'Servidor personalizado',
        status: 'unknown'
      };
      setServers([...servers, newServer]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", host: "", port: 8211 });
  };

  const handleEdit = (server: Server) => {
    setEditing(server);
    setForm({ name: server.name, host: server.host, port: server.port });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setServers(servers.filter(s => s.id !== id));
  };

  return (
    <div className="container" style={{ maxWidth: 1000, margin: "40px auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Servidores Palworld</h2>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={fetchServers} disabled={loading}>
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>Adicionar Servidor</button>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning" role="alert">
          <strong>Aviso:</strong> {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
          <h4>{editing ? 'Editar Servidor' : 'Adicionar Novo Servidor'}</h4>
          <div className="row">
            <div className="col-md-6">
              <label>Nome</label>
              <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="col-md-4">
              <label>Host</label>
              <input type="text" className="form-control" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <label>Porta</label>
              <input type="number" className="form-control" value={form.port} onChange={e => setForm({ ...form, port: Number(e.target.value) })} required />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-2">{editing ? "Atualizar" : "Adicionar"}</button>
          <button type="button" className="btn btn-secondary mt-2 ms-2" onClick={() => { setShowForm(false); setEditing(null); }}>Cancelar</button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando servidores...</p>
        </div>
      ) : (
        <div className="row">
          {servers.map(server => (
            <div key={server.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{server.name}</h5>
                  <span className={`badge ${server.status === 'online' ? 'bg-success' : server.status === 'offline' ? 'bg-danger' : 'bg-warning'}`}>
                    {server.status || 'Desconhecido'}
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    <strong>Host:</strong> {server.host}:{server.port}
                  </p>
                  {server.description && (
                    <p className="card-text">
                      <strong>Descrição:</strong> {server.description}
                    </p>
                  )}
                  {server.version && (
                    <p className="card-text">
                      <strong>Versão:</strong> {server.version}
                    </p>
                  )}
                  {server.players !== undefined && server.maxPlayers && (
                    <p className="card-text">
                      <strong>Jogadores:</strong> {server.players}/{server.maxPlayers}
                    </p>
                  )}
                </div>
                <div className="card-footer">
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(server)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(server.id)}>Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
