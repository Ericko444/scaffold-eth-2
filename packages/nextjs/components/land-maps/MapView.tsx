// src/MapView.tsx
import React, { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Land } from '~~/types/land';
import { convertIntoFeatureCollection } from '~~/utils/lands/lands';
import GeoJSONLayer from './GeoJSONLayer';

// Fix Leaflet's default icon paths (necessary when using webpack and TypeScript)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

interface MapViewProps {
    lands: Land[] | undefined;
}

const MapView: React.FC<MapViewProps> = ({ lands }) => {
    // Convert lands into a FeatureCollection when lands change
    const data = useMemo(() => {
        if (!lands || lands.length === 0) {
            return null;
        }
        return convertIntoFeatureCollection(lands);
    }, [lands]);

    const position: [number, number] = [-19.887306227883506, 47.05264176331643];

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
            {data && <GeoJSONLayer data={data} />}
        </MapContainer>
    );
};

export default MapView;
