import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { ImageOverlay, MapContainer, Marker, useMap } from 'react-leaflet';
import type { AtlasEntry, CategoryId, MapCoordinateBounds } from '../types/game';
import { categoryById } from '../data/categories';
import 'leaflet/dist/leaflet.css';

function FitMap({ resetKey, bounds }: { resetKey: number; bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { animate: false, padding: [16, 16] });
  }, [bounds, map, resetKey]);
  return null;
}

function toLeafletPosition(
  entry: AtlasEntry,
  mapWidth: number,
  mapHeight: number,
  coordinateBounds: MapCoordinateBounds,
): [number, number] {
  const coords = entry.coordinates!;
  const pixelX = ((coords.x - coordinateBounds.minX) / (coordinateBounds.maxX - coordinateBounds.minX)) * mapWidth;
  const pixelY = ((coordinateBounds.maxY - coords.y) / (coordinateBounds.maxY - coordinateBounds.minY)) * mapHeight;
  // Leaflet's simple CRS has an upward-positive vertical axis; image pixels start at the top.
  return [mapHeight - pixelY, pixelX];
}

function FocusSelected({ entries, selectedId, mapWidth, mapHeight, coordinateBounds }: {
  entries: AtlasEntry[];
  selectedId: string | null;
  mapWidth: number;
  mapHeight: number;
  coordinateBounds: MapCoordinateBounds;
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const selected = entries.find((entry) => entry.id === selectedId);
    if (selected?.coordinates) {
      map.flyTo(toLeafletPosition(selected, mapWidth, mapHeight, coordinateBounds), Math.max(map.getZoom(), 0.4), { duration: 0.45 });
    }
  }, [entries, map, mapWidth, mapHeight, coordinateBounds, selectedId]);
  return null;
}

function markerIcon(categoryId: CategoryId, complete: boolean): L.DivIcon {
  const category = categoryById[categoryId];
  return L.divIcon({
    className: 'atlas-marker-wrap',
    html: `<span class="atlas-marker ${complete ? 'is-complete' : ''}" style="--marker-colour:${category.colour}"><span>${category.marker}</span></span>`,
    iconSize: [30, 36],
    iconAnchor: [15, 18],
    popupAnchor: [0, -16],
  });
}

interface MapViewProps {
  entries: AtlasEntry[];
  visibleCategories: Set<CategoryId>;
  completed: Set<string>;
  selectedId: string | null;
  onSelect: (entry: AtlasEntry) => void;
  resetKey: number;
  mapImage: string;
  mapWidth: number;
  mapHeight: number;
  coordinateBounds: MapCoordinateBounds;
}

export function MapView({ entries, visibleCategories, completed, selectedId, onSelect, resetKey, mapImage, mapWidth, mapHeight, coordinateBounds }: MapViewProps) {
  const mapBounds = useMemo<L.LatLngBoundsExpression>(() => [[0, 0], [mapHeight, mapWidth]], [mapHeight, mapWidth]);
  const mapImageUrl = `${import.meta.env.BASE_URL}${mapImage}`;
  const visibleEntries = entries.filter((entry) => entry.coordinates && visibleCategories.has(entry.category));

  return (
    <MapContainer
      className="hyrule-map"
      crs={L.CRS.Simple}
      bounds={mapBounds}
      minZoom={-1.2}
      maxZoom={2.5}
      zoomSnap={0.25}
      zoomDelta={0.25}
      maxBounds={mapBounds}
      maxBoundsViscosity={0.86}
      zoomControl={false}
      attributionControl={false}
    >
      <ImageOverlay url={mapImageUrl} bounds={mapBounds} />
      <FitMap resetKey={resetKey} bounds={mapBounds} />
      <FocusSelected entries={entries} selectedId={selectedId} mapWidth={mapWidth} mapHeight={mapHeight} coordinateBounds={coordinateBounds} />
      {visibleEntries.map((entry) => (
        <Marker
          key={entry.id}
          position={toLeafletPosition(entry, mapWidth, mapHeight, coordinateBounds)}
          icon={markerIcon(entry.category, completed.has(entry.id))}
          eventHandlers={{ click: () => onSelect(entry) }}
          zIndexOffset={selectedId === entry.id ? 1000 : 0}
        />
      ))}
    </MapContainer>
  );
}
