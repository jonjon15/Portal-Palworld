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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("palworld_auth")) {
      router.push("/login");
    }
    fetchPlayers();
  }, [router]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/players');
      if (!response.ok) {
        throw new Error('Erro ao buscar jogadores');
      }
      const data = await response.json();
      // Mapear dados da API para o formato esperado pelo mapa
      const mappedPlayers: Player[] = (data.players || []).map((player: any) => ({
        id: player.id || Math.random(),
        name: player.name || 'Unknown',
        localizacao_x: player.x || player.localizacao_x || 0,
        localizacao_y: player.y || player.localizacao_y || 0,
        localizacao_z: player.z || player.localizacao_z || 0
      }));
      setPlayers(mappedPlayers);
    } catch (error: any) {
      console.error('Erro ao buscar jogadores:', error);
      setError(error.message || 'Erro ao carregar jogadores no mapa');
      // Fallback para dados vazios
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 1200, margin: "40px auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mapa Interativo</h2>
        <button className="btn btn-outline-primary" onClick={fetchPlayers} disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar Jogadores'}
        </button>
      </div>

      {error && (
        <div className="alert alert-warning" role="alert">
          <strong>Aviso:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando mapa...</span>
          </div>
          <p className="mt-2">Carregando jogadores no mapa...</p>
        </div>
      ) : (
        <Map players={players} />
      )}
    </div>
  );
}
