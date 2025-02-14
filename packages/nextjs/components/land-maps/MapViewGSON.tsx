// src/MapViewGSON.tsx
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Land } from '~~/types/land';
import { convertIntoFeatureCollection, LandProperties } from '~~/utils/lands/lands';
import GeoJSONLayer from './GeoJSONLayer';
import { FeatureCollection, GeoJsonObject, Polygon } from 'geojson';
import FitBoundsComponent from './FitBoundsComponent';
import { geoDataZones } from '~~/app/explore/data/zones';
import { geoDataPoints } from '~~/app/explore/data/points';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

// Fix Leaflet's default icon paths (necessary when using webpack and TypeScript)
// delete (L.Icon.Default.prototype as any)._getIconUrl;

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
//     iconUrl: require('leaflet/dist/images/marker-icon.png').default,
//     shadowUrl: require('leaflet/dist/images/marker-shadow.png').default
// });

interface MapViewGSONProps {
    data: GeoJsonObject | null;
    contexts: string[]
}

const MapViewGSON: React.FC<MapViewGSONProps> = ({ data, contexts }) => {
    const position: [number, number] = [-19.887306227883506, 47.05264176331643];
    const dt = useMemo(() => {
        if (!data) {
            return null;
        }
        return data;
    }, [data]);

    const zones = geoDataZones;
    const points = geoDataPoints;

    return (
        <MapContainer
            center={position}
            zoom={17}
            style={{ height: '800px', width: '1400px' }}
        >
            {/* Base map layer */}
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {/* GeoJSON layer */}
            {dt && (
                <>
                    {/* {contexts.includes("water") && (<GeoJSONLayer data={points} />)}
                    {contexts.includes("land occupation") && (<GeoJSONLayer data={zones} style={{
                        color: 'red',
                        weight: 2,
                    }} />)} */}

                    <GeoJSONLayer data={dt} style={{
                        color: 'blue',
                        weight: 2,
                    }} />
                    <FitBoundsComponent data={dt} />
                </>
            )}
        </MapContainer>
    );
};

export default MapViewGSON;
