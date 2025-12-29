"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const [message, setMessage] = useState("");
  const [steamId, setSteamId] = useState("");
  const [palName, setPalName] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const [level, setLevel] = useState(1);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("palworld_auth")) {
      router.push("/login");
    }
  }, [router]);

  const sendCommand = async (action: string, data: any = {}) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setResponse(`✅ ${result.description}\nResposta: ${result.response}`);
      } else {
        setResponse(`❌ Erro: ${result.error || 'Comando falhou'}`);
      }
    } catch (error: any) {
      setResponse(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendBroadcast = async () => {
    if (!message.trim()) {
      setResponse("❌ Digite uma mensagem para o broadcast");
      return;
    }
    await sendCommand('broadcast', { message: message.trim() });
  };

  const kickPlayer = async () => {
    if (!steamId.trim()) {
      setResponse("❌ Digite o Steam ID do jogador");
      return;
    }
    await sendCommand('kick', { steamId: steamId.trim() });
  };

  const banPlayer = async () => {
    if (!steamId.trim()) {
      setResponse("❌ Digite o Steam ID do jogador");
      return;
    }
    await sendCommand('ban', { steamId: steamId.trim() });
  };

  const teleportPlayer = async () => {
    if (!steamId.trim()) {
      setResponse("❌ Digite o Steam ID do jogador");
      return;
    }
    await sendCommand('teleport', { steamId: steamId.trim(), x, y, z });
  };

  const summonPal = async () => {
    if (!palName.trim()) {
      setResponse("❌ Digite o nome do Pal");
      return;
    }
    await sendCommand('summon', { palName: palName.trim(), x, y, z, level });
  };

  return (
    <div className="container" style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>🛠️ Administração do Servidor</h2>
      <p className="text-muted">Comandos RCON para gerenciamento avançado do servidor Palworld</p>

      <div className="mb-4">
        <h4>📢 Broadcast</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Digite a mensagem para broadcast"
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          onClick={sendBroadcast}
          disabled={loading || !message.trim()}
        >
          {loading ? '⏳ Enviando...' : '📢 Enviar Broadcast'}
        </button>
      </div>

      <div className="mb-4">
        <h4>👢 Kick Player</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Steam ID do jogador"
          value={steamId}
          onChange={e => setSteamId(e.target.value)}
          disabled={loading}
        />
        <button
          className="btn btn-warning"
          onClick={kickPlayer}
          disabled={loading || !steamId.trim()}
        >
          {loading ? '⏳ Executando...' : '👢 Kick Player'}
        </button>
      </div>

      <div className="mb-4">
        <h4>🚫 Ban Player</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Steam ID do jogador"
          value={steamId}
          onChange={e => setSteamId(e.target.value)}
          disabled={loading}
        />
        <button
          className="btn btn-danger"
          onClick={banPlayer}
          disabled={loading || !steamId.trim()}
        >
          {loading ? '⏳ Executando...' : '🚫 Ban Player'}
        </button>
      </div>

      <div className="mb-4">
        <h4>✈️ Teleport Player</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Steam ID do jogador"
          value={steamId}
          onChange={e => setSteamId(e.target.value)}
          disabled={loading}
        />
        <div className="row">
          <div className="col"><input type="number" className="form-control" placeholder="X" value={x} onChange={e => setX(Number(e.target.value))} disabled={loading} /></div>
          <div className="col"><input type="number" className="form-control" placeholder="Y" value={y} onChange={e => setY(Number(e.target.value))} disabled={loading} /></div>
          <div className="col"><input type="number" className="form-control" placeholder="Z" value={z} onChange={e => setZ(Number(e.target.value))} disabled={loading} /></div>
        </div>
        <button
          className="btn btn-info mt-2"
          onClick={teleportPlayer}
          disabled={loading || !steamId.trim()}
        >
          {loading ? '⏳ Teleportando...' : '✈️ Teleport Player'}
        </button>
      </div>

      <div className="mb-4">
        <h4>🐾 Summon Pal</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nome do Pal (ex: Anubis, Kitsun...)"
          value={palName}
          onChange={e => setPalName(e.target.value)}
          disabled={loading}
        />
        <div className="row">
          <div className="col"><input type="number" className="form-control" placeholder="X" value={x} onChange={e => setX(Number(e.target.value))} disabled={loading} /></div>
          <div className="col"><input type="number" className="form-control" placeholder="Y" value={y} onChange={e => setY(Number(e.target.value))} disabled={loading} /></div>
          <div className="col"><input type="number" className="form-control" placeholder="Z" value={z} onChange={e => setZ(Number(e.target.value))} disabled={loading} /></div>
          <div className="col"><input type="number" className="form-control" placeholder="Level" value={level} onChange={e => setLevel(Number(e.target.value))} disabled={loading} min="1" /></div>
        </div>
        <button
          className="btn btn-success mt-2"
          onClick={summonPal}
          disabled={loading || !palName.trim()}
        >
          {loading ? '⏳ Invocando...' : '🐾 Summon Pal'}
        </button>
      </div>

      {response && (
        <div className={`alert mt-4 ${response.includes('❌') ? 'alert-danger' : 'alert-success'}`}>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{response}</pre>
        </div>
      )}
    </div>
  );
}