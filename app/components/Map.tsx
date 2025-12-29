"use client";
import { MapContainer, ImageOverlay, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ReactNode, forwardRef } from 'react';
import { PlayerMarker } from './PlayerMarker';
import { Player } from '../../types/palworld';

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

interface MapProps {
  children?: ReactNode;
  onMapClick?: (coords: L.LatLng) => void;
  onPlayerClick?: (player: Player) => void;
  players?: Player[];
}

const Map = forwardRef<L.Map, MapProps>(({ children, onMapClick, onPlayerClick, players = [] }, ref) => {
  return (
    <MapContainer
      ref={ref}
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
        <PlayerMarker key={player.id} player={player} onClick={onPlayerClick} />
      ))}
      {children}
    </MapContainer>
  );
});

Map.displayName = 'Map';

export default Map;
