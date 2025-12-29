"use client";
import { MapContainer, ImageOverlay, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ReactNode } from 'react';
import { PlayerMarker } from './PlayerMarker';

const MAP_BOUNDS: [[number, number], [number, number]] = [
  [0, 0], // top-left
  [4096, 4096], // bottom-right (ajuste conforme o tamanho real do mapa)
];

function MapClickHandler({ onClick }: { onClick: (coords: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

interface Player {
  id: number;
  name: string;
  localizacao_x: number;
  localizacao_y: number;
  localizacao_z: number;
}

interface MapProps {
  children?: ReactNode;
  onMapClick?: (coords: L.LatLng) => void;
  players?: Player[];
}

export default function Map({ children, onMapClick, players = [] }: MapProps) {
  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={MAP_BOUNDS}
      minZoom={-2}
      maxZoom={2}
      style={{ height: '600px', width: '100%' }}
    >
      <ImageOverlay
        url="/map/palworld-map.png"
        bounds={MAP_BOUNDS}
      />
      {onMapClick && <MapClickHandler onClick={onMapClick} />}
      {players.map(player => (
        <PlayerMarker key={player.id} name={player.name} x={player.localizacao_x} y={player.localizacao_y} />
      ))}
      {children}
    </MapContainer>
  );
}
