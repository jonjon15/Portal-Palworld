import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

interface PlayerMarkerProps {
  name: string;
  x: number;
  y: number;
}

const playerIcon = new L.Icon({
  iconUrl: '/map/player-marker.png', // Adicione esse ícone em public/map
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export function PlayerMarker({ name, x, y }: PlayerMarkerProps) {
  return (
    <Marker position={[y, x]} icon={playerIcon}>
      <Tooltip>{name}</Tooltip>
    </Marker>
  );
}
