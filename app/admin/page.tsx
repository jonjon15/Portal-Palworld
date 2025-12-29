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
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("palworld_auth")) {
      router.push("/login");
    }
  }, [router]);

  const sendCommand = async (command: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data.response);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse(`Error: ${error}`);
    }
  };

  const sendBroadcast = async () => {
    await sendCommand(`Broadcast ${message}`);
  };

  const kickPlayer = async () => {
    await sendCommand(`KickPlayer ${steamId}`);
  };

  const banPlayer = async () => {
    await sendCommand(`BanPlayer ${steamId}`);
  };

  const teleportPlayer = async () => {
    await sendCommand(`TeleportToPlayer ${steamId} ${x} ${y} ${z}`);
  };

  const summonPal = async () => {
    await sendCommand(`SpawnDino "${palName}" ${x} ${y} ${z} ${level}`);
  };

  return (
    <div className="container" style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>Administração</h2>
      <div className="mb-4">
        <h4>Broadcast</h4>
        <input type="text" className="form-control mb-2" placeholder="Mensagem" value={message} onChange={e => setMessage(e.target.value)} />
        <button className="btn btn-primary" onClick={sendBroadcast}>Enviar Broadcast</button>
      </div>
      <div className="mb-4">
        <h4>Kick Player</h4>
        <input type="text" className="form-control mb-2" placeholder="Steam ID" value={steamId} onChange={e => setSteamId(e.target.value)} />
        <button className="btn btn-warning" onClick={kickPlayer}>Kick</button>
      </div>
      <div className="mb-4">
        <h4>Ban Player</h4>
        <input type="text" className="form-control mb-2" placeholder="Steam ID" value={steamId} onChange={e => setSteamId(e.target.value)} />
        <button className="btn btn-danger" onClick={banPlayer}>Ban</button>
      </div>
      <div className="mb-4">
        <h4>Teleport Player</h4>
        <input type="text" className="form-control mb-2" placeholder="Steam ID" value={steamId} onChange={e => setSteamId(e.target.value)} />
        <div className="row">
          <div className="col"><input type="number" className="form-control" placeholder="X" value={x} onChange={e => setX(Number(e.target.value))} /></div>
          <div className="col"><input type="number" className="form-control" placeholder="Y" value={y} onChange={e => setY(Number(e.target.value))} /></div>
          <div className="col"><input type="number" className="form-control" placeholder="Z" value={z} onChange={e => setZ(Number(e.target.value))} /></div>
        </div>
        <button className="btn btn-info mt-2" onClick={teleportPlayer}>Teleport</button>
      </div>
      <div className="mb-4">
        <h4>Summon Pal</h4>
        <input type="text" className="form-control mb-2" placeholder="Pal Name" value={palName} onChange={e => setPalName(e.target.value)} />
        <div className="row">
          <div className="col"><input type="number" className="form-control" placeholder="X" value={x} onChange={e => setX(Number(e.target.value))} /></div>
          <div className="col"><input type="number" className="form-control" placeholder="Y" value={y} onChange={e => setY(Number(e.target.value))} /></div>
          <div className="col"><input type="number" className="form-control" placeholder="Z" value={z} onChange={e => setZ(Number(e.target.value))} /></div>
          <div className="col"><input type="number" className="form-control" placeholder="Level" value={level} onChange={e => setLevel(Number(e.target.value))} /></div>
        </div>
        <button className="btn btn-success mt-2" onClick={summonPal}>Summon</button>
      </div>
      {response && <div className="alert alert-info mt-4">{response}</div>}
    </div>
  );
}