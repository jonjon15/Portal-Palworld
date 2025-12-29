"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Server {
  id: number;
  name: string;
  host: string;
  port: number;
}

export default function ServidoresPage() {
  const [servers, setServers] = useState<Server[]>([]);
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
    // Simulação
    const mockServers: Server[] = [
      { id: 1, name: "Servidor 1", host: "127.0.0.1", port: 8211 },
    ];
    setServers(mockServers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setServers(servers.map(s => s.id === editing.id ? { ...s, ...form } : s));
    } else {
      const newServer: Server = { id: Date.now(), ...form };
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

  const handleDelete = (id: number) => {
    setServers(servers.filter(s => s.id !== id));
  };

  return (
    <div className="container" style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>Servidores</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>Adicionar Servidor</button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 border">
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
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Host</th>
            <th>Porta</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {servers.map(server => (
            <tr key={server.id}>
              <td>{server.name}</td>
              <td>{server.host}</td>
              <td>{server.port}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(server)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(server.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
