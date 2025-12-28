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

export default function HomePage() {
  const [serverName, setServerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [spawnModal, setSpawnModal] = useState<{ open: boolean; coords: { x: number; y: number; z: number } | null }>({ open: false, coords: null });

  useEffect(() => {
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
  }, []);

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
        <Map onMapClick={handleMapClick}>
          {players.map(player => (
            <PlayerMarker key={player.name} name={player.name} x={player.x} y={player.y} />
          ))}
        </Map>
        <SpawnModal
          isOpen={spawnModal.open}
          onClose={() => setSpawnModal({ open: false, coords: null })}
          onSpawn={handleSpawn}
          coords={spawnModal.coords}
        />
      </div>
    </main>
  );
}
