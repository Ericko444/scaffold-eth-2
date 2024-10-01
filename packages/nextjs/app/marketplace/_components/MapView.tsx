// src/MapView.js
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { geojsonData } from './data'; // Import your GeoJSON data
import { GeoJsonObject } from 'geojson';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon paths (necessary when using webpack and TypeScript)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
})

const MapView = () => {
    // Set the map center to the first coordinate in your GeoJSON data
    const position: [number, number] = [-19.887306227883506, 47.05264176331643];

    return (
        <MapContainer
            center={position}
            zoom={17}
            style={{ height: '600px', width: '1200px' }}
        >
            {/* Base map layer */}
            <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* GeoJSON layer */}
            <GeoJSON data={geojsonData as GeoJsonObject} />
        </MapContainer>
    );
};

export default MapView;
