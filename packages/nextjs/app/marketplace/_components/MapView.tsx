// src/MapView.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { geojsonData } from './data'; // Import your GeoJSON data
import { FeatureCollection, GeoJsonObject, Polygon } from 'geojson';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Land } from '~~/types/land';
import { convertIntoFeatureCollection, LandProperties } from '~~/utils/lands/lands';
import { useEffect } from 'react';

// Fix Leaflet's default icon paths (necessary when using webpack and TypeScript)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
})

interface MapViewProp {
    lands: Land[] | undefined
}

const MapView = ({ lands }: MapViewProp) => {
    const [data, setData] = useState<FeatureCollection<Polygon, LandProperties>>();
    useEffect(() => {
        if (!lands) {
            // No lands to display, perhaps show a message or skip rendering the map
            return;
        }

        if (!!lands && lands?.length > 0) {
            const data = convertIntoFeatureCollection(lands);
            console.log(data);
            setData(data);
        }

        // Logic to render the map with the provided lands
    }, [lands]);
    // Set the map center to the first coordinate in your GeoJSON data
    const position: [number, number] = [-19.887306227883506, 47.05264176331643];
    console.log(lands);

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
            <GeoJSON data={data as unknown as GeoJsonObject} />
        </MapContainer>
    );
};

export default MapView;
