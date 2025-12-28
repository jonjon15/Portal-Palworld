
"use client";
import * as React from 'react';
import { useState } from 'react';


interface SpawnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpawn: (data: { palId: string; quantity: number; coordinates: { x: number; y: number; z: number } }) => void;
  coords: { x: number; y: number; z: number } | null;
}

export function SpawnModal({ isOpen, onClose, onSpawn, coords }: SpawnModalProps) {
  const [palId, setPalId] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !coords) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Spawn de Pal</h2>
        <label className="block mb-2">
          Pal ID:
          <input
            className="border p-1 w-full"
            value={palId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPalId(e.target.value)}
            placeholder="Ex: 101"
          />
        </label>
        <label className="block mb-2">
          Quantidade:
          <input
            className="border p-1 w-full"
            type="number"
            min={1}
            value={quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))}
          />
        </label>
        <div className="mb-2 text-sm text-gray-600">
          Coordenadas: X: {coords.x}, Y: {coords.y}, Z: {coords.z}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => onSpawn({ palId, quantity, coordinates: coords })}
          >
            Spawn
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
