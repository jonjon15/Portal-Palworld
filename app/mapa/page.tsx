"use client";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

interface Player {
  id: number;
  name: string;
  localizacao_x: number;
  localizacao_y: number;
  localizacao_z: number;
}

export default function MapaPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("palworld_auth")) {
      router.push("/login");
    }
    // Simulação de buscar jogadores
    const mockPlayers: Player[] = [
      { id: 1, name: "Player1", localizacao_x: 100, localizacao_y: 200, localizacao_z: 0 },
      { id: 2, name: "Player2", localizacao_x: 150, localizacao_y: 250, localizacao_z: 0 },
    ];
    setPlayers(mockPlayers);
  }, [router]);

  return (
    <div className="container" style={{ maxWidth: 1200, margin: "40px auto" }}>
      <h2>Mapa Interativo</h2>
      <Map players={players} />
    </div>
  );
}
