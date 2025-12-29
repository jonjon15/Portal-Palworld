"use client";
import React, { useEffect, useState, Suspense } from 'react';
// import { PlayerMarker } from './PlayerMarker'; // Removido - PlayerMarker deve ser usado apenas dentro do Map
import { SpawnModal } from './SpawnModal';
import { AuthGate } from './AuthGate';

// Remover import do Map do topo

interface Player {
  id: number;
  name: string;
  localizacao_x: number;
  localizacao_y: number;
  localizacao_z: number;
}

export function HomeDashboard() {
  const [serverName, setServerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [spawnModal, setSpawnModal] = useState<{ open: boolean; coords: { x: number; y: number; z: number } | null }>({ open: false, coords: null });
  const [isClient, setIsClient] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    setSpawnModal({ open: true, coords: { x: coords.lng, y: coords.lat, z: 0 } });
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
        // Recarregar jogadores após sincronização
        const playersResponse = await fetch('/api/players');
        const playersData = await playersResponse.json();
        setPlayers(playersData.players || []);
        setLastSync(new Date().toLocaleString('pt-BR'));
        alert(`✅ ${data.message}`);
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

  const handleSpawn = async (data: { palId: string; quantity: number; coordinates: { x: number; y: number; z: number } }) => {
    await fetch('/api/pals/spawn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSpawnModal({ open: false, coords: null });
  };

  useEffect(() => {
    fetch('/api/server/info')
      .then(res => res.json())
      .then(data => setServerName(data.serverName || 'Servidor Palworld'));
    const fetchPlayers = () => {
      fetch('/api/players')
        .then(res => res.json())
        .then(data => setPlayers((data.players || []).map((p: any) => ({
          id: p.id || 0,
          name: p.name,
          localizacao_x: p.x || 0,
          localizacao_y: p.y || 0,
          localizacao_z: p.z || 0,
        }))));
    };
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthGate>
      <main className="h-screen w-screen flex flex-col">
        <header className="bg-gray-900 text-white p-4 text-xl font-bold">
          {serverName}
        </header>
        <div className="flex-1 relative">
          <div className="container" style={{ maxWidth: 1200, margin: "40px auto" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Dashboard</h2>
              <button
                className="btn btn-primary"
                onClick={syncPlayers}
                disabled={syncLoading}
              >
                {syncLoading ? '🔄 Sincronizando...' : '🔄 Sincronizar Jogadores'}
              </button>
            </div>

            {lastSync && (
              <div className="alert alert-info mb-3">
                📅 Última sincronização: {lastSync}
              </div>
            )}

            <div className="mb-4">
              <strong>Servidor:</strong> {serverName}<br />
              <strong>Jogadores online:</strong> {players.length}
            </div>
            <div className="mb-4">
              <h4>Jogadores</h4>
              {players.length === 0 ? (
                <p>Nenhum jogador online.</p>
              ) : (
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>X</th>
                      <th>Y</th>
                      <th>Z</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, idx) => (
                      <tr key={idx}>
                        <td>{player.name}</td>
                        <td>{player.localizacao_x}</td>
                        <td>{player.localizacao_y}</td>
                        <td>{player.localizacao_z}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {isClient && (
              <Suspense fallback={<div>Carregando mapa...</div>}>
                {(() => {
                  const Map = React.lazy(() => import('./Map'));
                  return <Map onMapClick={handleMapClick} players={players} />;
                })()}
              </Suspense>
            )}
            {/* Removido: PlayerMarker deve ser renderizado dentro do Map */}
            <SpawnModal isOpen={spawnModal.open} coords={spawnModal.coords} onClose={() => setSpawnModal({ open: false, coords: null })} onSpawn={handleSpawn} />
          </div>
        </div>
      </main>
    </AuthGate>
  );
}
