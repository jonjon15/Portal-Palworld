"use client";
import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Server, Player } from '../../types/palworld';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function MapaPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [teleportCoords, setTeleportCoords] = useState({ x: 0, y: 0, z: 0 });
  const [showSummonModal, setShowSummonModal] = useState(false);
  const [summonCoords, setSummonCoords] = useState({ x: 0, y: 0, z: 0 });
  const [summonForm, setSummonForm] = useState({ name: '', level: 1 });
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("palworld_auth")) {
        router.push("/login");
      } else {
        setIsAdmin(localStorage.getItem("palworld_role") === "admin");
      }
    }
    fetchServers();
    fetchPlayers();
  }, [router]);

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers');
      const data = await response.json();
      if (response.ok && data.servers) {
        setServers(data.servers);
      }
    } catch (error) {
      console.error('Erro ao buscar servidores:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/players');
      if (!response.ok) {
        throw new Error('Erro ao buscar jogadores');
      }
      const data = await response.json();
      const mappedPlayers: Player[] = (data.players || []).map((player: any) => ({
        id: player.id || Math.random(),
        name: player.name || 'Unknown',
        x: player.x || player.localizacao_x || 0,
        y: player.y || player.localizacao_y || 0,
        z: player.z || player.localizacao_z || 0,
        steam_id: player.steamId || player.steam_id || ''
      }));
      setPlayers(mappedPlayers);
    } catch (error: any) {
      console.error('Erro ao buscar jogadores:', error);
      setError(error.message || 'Erro ao carregar jogadores no mapa');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setTeleportCoords({ x: player.x, y: player.y, z: player.z });
    setShowPlayerModal(true);
  };

  const handleMapClick = (coords: any) => {
    if (isAdmin) {
      setSummonCoords({ x: coords.lng, y: coords.lat, z: 0 });
      setShowSummonModal(true);
    }
  };

  const handleTeleport = async () => {
    if (!selectedPlayer || !selectedPlayer.steam_id) {
      alert('Steam ID não encontrado para este jogador');
      return;
    }
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'teleport',
          steamId: selectedPlayer.steam_id,
          x: teleportCoords.x,
          y: teleportCoords.y,
          z: teleportCoords.z
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('✅ Jogador teleportado com sucesso!');
        setShowPlayerModal(false);
      } else {
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      alert('❌ Erro ao teleportar jogador');
    }
  };

  const handleSummon = async () => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'summon',
          palName: summonForm.name,
          level: summonForm.level,
          x: summonCoords.x,
          y: summonCoords.y,
          z: summonCoords.z
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('✅ Pal invocado com sucesso!');
        setShowSummonModal(false);
        setSummonForm({ name: '', level: 1 });
      } else {
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      alert('❌ Erro ao invocar Pal');
    }
  };

  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([2048, 2048], 0);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 1400, margin: "40px auto" }}>
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1>🗺️ Mapa Interativo</h1>
            <div>
              <label htmlFor="serverFilter" className="me-2">Filtrar por Servidor:</label>
              <select
                id="serverFilter"
                className="form-select d-inline-block w-auto"
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
              >
                <option value="">Todos os Servidores</option>
                {servers.map(server => (
                  <option key={server.id} value={server.id}>{server.name}</option>
                ))}
              </select>
              <button
                id="refreshBtn"
                className="btn btn-sm btn-primary ms-2"
                onClick={fetchPlayers}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise"></i> {loading ? 'Atualizando...' : 'Atualizar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-9">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Localização dos Jogadores</h5>
              <div className="map-controls">
                <button id="zoomInBtn" className="btn btn-sm btn-secondary" title="Aumentar Zoom" onClick={zoomIn}>
                  <i className="bi bi-plus-lg"></i>
                </button>
                <button id="zoomOutBtn" className="btn btn-sm btn-secondary" title="Diminuir Zoom" onClick={zoomOut}>
                  <i className="bi bi-dash-lg"></i>
                </button>
                <button id="resetViewBtn" className="btn btn-sm btn-secondary" title="Resetar Visualização" onClick={resetView}>
                  <i className="bi bi-house"></i>
                </button>
              </div>
            </div>
            <div className="map-container">
              {error && (
                <div className="alert alert-warning m-3" role="alert">
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
                <Map
                  ref={mapRef}
                  players={players}
                  onMapClick={handleMapClick}
                  onPlayerClick={handlePlayerClick}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Jogadores Online (<span id="playerCount">{players.length}</span>)</h5>
            </div>
            <div className="card-body" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {players.length === 0 ? (
                <p className="text-muted text-center">Nenhum jogador online</p>
              ) : (
                players.map(player => (
                  <div key={player.id} className="d-flex align-items-center mb-2">
                    <span className="badge bg-success me-2">●</span>
                    <span>{player.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5 className="mb-0">Legenda</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <span className="legend-marker player-marker me-2"></span>
                <span>Jogador</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <span className="legend-marker boss-marker me-2"></span>
                <span>Boss Tower</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="legend-marker travel-marker me-2"></span>
                <span>Fast Travel</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="card mt-3">
              <div className="card-header">
                <h5 className="mb-0">Ações Admin</h5>
              </div>
              <div className="card-body">
                <button
                  id="summonPalBtn"
                  className="btn btn-sm btn-warning w-100 mb-2"
                  onClick={() => alert('Clique em um local no mapa para invocar um Pal')}
                >
                  <i className="bi bi-stars"></i> Invocar Pal no Mapa
                </button>
                <small className="text-muted d-block">
                  Clique em um local no mapa e depois clique em "Invocar Pal"
                </small>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Ações do Jogador */}
      {showPlayerModal && selectedPlayer && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ações do Jogador</h5>
                <button type="button" className="btn-close" onClick={() => setShowPlayerModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Jogador:</strong> {selectedPlayer.name}</p>
                <p><strong>Posição:</strong> X: {selectedPlayer.x}, Y: {selectedPlayer.y}</p>
                
                {isAdmin && (
                  <>
                    <hr />
                    <h6>Teleportar para:</h6>
                    <div className="row g-2 mb-3">
                      <div className="col">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="X"
                          value={teleportCoords.x}
                          onChange={(e) => setTeleportCoords({ ...teleportCoords, x: Number(e.target.value) })}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Y"
                          value={teleportCoords.y}
                          onChange={(e) => setTeleportCoords({ ...teleportCoords, y: Number(e.target.value) })}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Z"
                          value={teleportCoords.z}
                          onChange={(e) => setTeleportCoords({ ...teleportCoords, z: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <button id="teleportBtn" className="btn btn-primary btn-sm w-100" onClick={handleTeleport}>
                      <i className="bi bi-geo-alt"></i> Teleportar
                    </button>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPlayerModal(false)}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Invocar Pal */}
      {showSummonModal && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Invocar Pal</h5>
                <button type="button" className="btn-close" onClick={() => setShowSummonModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Posição:</strong> X: {summonCoords.x}, Y: {summonCoords.y}</p>
                <div className="mb-3">
                  <label htmlFor="palName" className="form-label">Nome do Pal</label>
                  <input
                    type="text"
                    className="form-control"
                    id="palName"
                    placeholder="Ex: Lamball, Cattiva, Foxparks"
                    value={summonForm.name}
                    onChange={(e) => setSummonForm({ ...summonForm, name: e.target.value })}
                  />
                  <small className="text-muted">Use o nome interno do Pal</small>
                </div>
                <div className="mb-3">
                  <label htmlFor="palLevel" className="form-label">Nível</label>
                  <input
                    type="number"
                    className="form-control"
                    id="palLevel"
                    value={summonForm.level}
                    min="1"
                    max="50"
                    onChange={(e) => setSummonForm({ ...summonForm, level: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSummonModal(false)}>Cancelar</button>
                <button id="confirmSummonBtn" className="btn btn-warning" onClick={handleSummon}>
                  <i className="bi bi-stars"></i> Invocar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for modals */}
      {(showPlayerModal || showSummonModal) && (
        <div className="modal-backdrop fade show" onClick={() => { setShowPlayerModal(false); setShowSummonModal(false); }}></div>
      )}
    </div>
  );
}
