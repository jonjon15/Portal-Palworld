import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { PlayerMarker } from './components/PlayerMarker';
import { SpawnModal } from './components/SpawnModal';

const Map = dynamic(() => import('./components/Map'), { ssr: false });

interface Player {
  name: string;
  x: number;
  y: number;
  z: number;
}

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [serverName, setServerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [spawnModal, setSpawnModal] = useState<{ open: boolean; coords: { x: number; y: number; z: number } | null }>({ open: false, coords: null });
  const router = useRouter();

  useEffect(() => {
    // Verifica autenticação
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('palworld_auth');
      if (!isAuth) {
        router.push('/login');
        return;
      }
    }
    fetch('/api/server/info')
      .then(res => res.json())
      .then(data => setServerName(data.serverName || 'Servidor Palworld'));
    const fetchPlayers = () => {
      fetch('/api/players')
        .then(res => res.json())
        .then(data => setPlayers(data.players || []));
    };
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    setSpawnModal({ open: true, coords: { x: coords.lng, y: coords.lat, z: 0 } });
  };

  const handleSpawn = async (data: { palId: string; quantity: number; coordinates: { x: number; y: number; z: number } }) => {
    await fetch('/api/pals/spawn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSpawnModal({ open: false, coords: null });
  };

  return (
    <main className="h-screen w-screen flex flex-col">
      <header className="bg-gray-900 text-white p-4 text-xl font-bold">
        {serverName}
      </header>
      <div className="flex-1 relative">
        <div className="container" style={{ maxWidth: 1200, margin: "40px auto" }}>
          <h2>Dashboard</h2>
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
                      <td>{player.x}</td>
                      <td>{player.y}</td>
                      <td>{player.z}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <Map onMapClick={handleMapClick} players={players} />
          {players.map((player, idx) => (
            <PlayerMarker key={idx} player={player} />
          ))}
          <SpawnModal open={spawnModal.open} coords={spawnModal.coords} onClose={() => setSpawnModal({ open: false, coords: null })} onSpawn={handleSpawn} />
        </div>
      </div>
    </main>
  );
}
