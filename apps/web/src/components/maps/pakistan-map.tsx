'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PAKISTAN_CENTER } from '@shirkat-gah/shared';

interface MapPoint {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  progressPct?: number;
  province?: string;
}

interface PakistanMapProps {
  points?: MapPoint[];
  height?: string;
  className?: string;
}

export function PakistanMap({ points = [], height = '400px', className = '' }: PakistanMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [PAKISTAN_CENTER.lat, PAKISTAN_CENTER.lng],
      zoom: 5,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    points.forEach((point) => {
      if (!point.latitude || !point.longitude) return;

      const color =
        (point.progressPct ?? 0) >= 70
          ? '#047857'
          : (point.progressPct ?? 0) >= 40
            ? '#f97316'
            : '#ef4444';

      const marker = L.circleMarker([point.latitude, point.longitude], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      });

      marker.bindPopup(
        `<strong>${point.title}</strong><br/>${point.province ?? ''}<br/>Progress: ${point.progressPct ?? 0}%`,
      );
      marker.addTo(map);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [points]);

  return (
    <div
      ref={mapRef}
      className={`rounded-xl overflow-hidden border border-border z-0 ${className}`}
      style={{ height, width: '100%' }}
      role="img"
      aria-label="Interactive map of Pakistan showing project locations"
    />
  );
}
