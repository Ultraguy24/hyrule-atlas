import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import {
  ImageOverlay,
  MapContainer,
  Marker,
  useMap,
} from 'react-leaflet';

import type {
  AtlasEntry,
  CategoryId,
  MapProjection,
} from '../types/game';

import { categoryById } from '../data/categories';
import 'leaflet/dist/leaflet.css';

function FitMap({
  resetKey,
  bounds,
}: {
  resetKey: number;
  bounds: L.LatLngBoundsExpression;
}) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds, {
      animate: false,
      padding: [16, 16],
    });
  }, [bounds, map, resetKey]);

  return null;
}

/**
 * Convert BOTW world coordinates into Leaflet CRS.Simple coordinates.
 *
 * The source image's Y axis grows downwards.
 * Leaflet's simple coordinate system grows upwards.
 */
function toLeafletPosition(
  entry: AtlasEntry,
  mapWidth: number,
  mapHeight: number,
  projection: MapProjection,
): [number, number] {
  const coords = entry.coordinates!;

  const referenceX =
    projection.originX +
    coords.x * projection.pixelsPerWorldUnit;

  const referenceY =
    projection.originY +
    coords.y * projection.pixelsPerWorldUnit;

  const imageX =
    (referenceX / projection.referenceWidth) * mapWidth;

  const imageY =
    (referenceY / projection.referenceHeight) * mapHeight;

  return [
    mapHeight - imageY,
    imageX,
  ];
}

function FocusSelected({
  entries,
  selectedId,
  mapWidth,
  mapHeight,
  projection,
}: {
  entries: AtlasEntry[];
  selectedId: string | null;
  mapWidth: number;
  mapHeight: number;
  projection: MapProjection;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedId) return;

    const selected = entries.find(
      (entry) => entry.id === selectedId,
    );

    if (selected?.coordinates) {
      map.flyTo(
        toLeafletPosition(
          selected,
          mapWidth,
          mapHeight,
          projection,
        ),
        Math.max(map.getZoom(), 0.4),
        { duration: 0.45 },
      );
    }
  }, [
    entries,
    map,
    mapWidth,
    mapHeight,
    projection,
    selectedId,
  ]);

  return null;
}

function markerIcon(
  categoryId: CategoryId,
  complete: boolean,
): L.DivIcon {
  const category = categoryById[categoryId];

  return L.divIcon({
    className: 'atlas-marker-wrap',
    html: `
      <span
        class="atlas-marker ${complete ? 'is-complete' : ''}"
        style="--marker-colour:${category.colour}"
      >
        <span>${category.marker}</span>
      </span>
    `,
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
  projection: MapProjection;
}

export function MapView({
  entries,
  visibleCategories,
  completed,
  selectedId,
  onSelect,
  resetKey,
  mapImage,
  mapWidth,
  mapHeight,
  projection,
}: MapViewProps) {
  const mapBounds = useMemo<L.LatLngBoundsExpression>(
    () => [
      [0, 0],
      [mapHeight, mapWidth],
    ],
    [mapHeight, mapWidth],
  );

  const mapImageUrl =
    `${import.meta.env.BASE_URL}${mapImage}`;

  const visibleEntries = entries.filter(
    (entry) =>
      entry.coordinates &&
      visibleCategories.has(entry.category),
  );

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
      <ImageOverlay
        url={mapImageUrl}
        bounds={mapBounds}
      />

      <FitMap
        resetKey={resetKey}
        bounds={mapBounds}
      />

      <FocusSelected
        entries={entries}
        selectedId={selectedId}
        mapWidth={mapWidth}
        mapHeight={mapHeight}
        projection={projection}
      />

      {visibleEntries.map((entry) => (
        <Marker
          key={entry.id}
          position={toLeafletPosition(
            entry,
            mapWidth,
            mapHeight,
            projection,
          )}
          icon={markerIcon(
            entry.category,
            completed.has(entry.id),
          )}
          eventHandlers={{
            click: () => onSelect(entry),
          }}
          zIndexOffset={
            selectedId === entry.id ? 1000 : 0
          }
        />
      ))}
    </MapContainer>
  );
}
