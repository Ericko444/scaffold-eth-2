// src/MapViewGSON.tsx
import React, { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Land } from '~~/types/land';
import { convertIntoFeatureCollection, LandProperties } from '~~/utils/lands/lands';
import GeoJSONLayer from './GeoJSONLayer';
import { FeatureCollection, GeoJsonObject, Polygon } from 'geojson';
import FitBoundsComponent from './FitBoundsComponent';

// Fix Leaflet's default icon paths (necessary when using webpack and TypeScript)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

interface MapViewGSONProps {
    data: GeoJsonObject | null;
}

const MapViewGSON: React.FC<MapViewGSONProps> = ({ data }) => {
    const position: [number, number] = [-19.887306227883506, 47.05264176331643];

    const dt = useMemo(() => {
        if (!data) {
            return null;
        }
        return data;
    }, [data]);

    return (
        <MapContainer
            center={position}
            zoom={17}
            style={{ height: '600px', width: '1200px' }}
        >
            {/* Base map layer */}
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {/* GeoJSON layer */}
            {dt && (
                <>
                    <GeoJSONLayer data={dt} />
                    <FitBoundsComponent data={dt} />
                </>
            )}
        </MapContainer>
    );
};

export default MapViewGSON;
