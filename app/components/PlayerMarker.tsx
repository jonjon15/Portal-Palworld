import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Player } from '../../types/palworld';

interface PlayerMarkerProps {
  player: Player;
  onClick?: (player: Player) => void;
}

const playerIcon = new L.Icon({
  iconUrl: '/map/player-marker.png', // Adicione esse ícone em public/map
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export function PlayerMarker({ player, onClick }: PlayerMarkerProps) {
  return (
    <Marker
      position={[player.y, player.x]}
      icon={playerIcon}
      eventHandlers={{
        click: () => onClick && onClick(player),
      }}
    >
      <Tooltip>{player.name}</Tooltip>
    </Marker>
  );
}
