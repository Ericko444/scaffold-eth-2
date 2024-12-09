// src/GeoJSONLayer.tsx
import React, { useEffect, useRef } from 'react';
import { GeoJSON } from 'react-leaflet';
import { Feature, Geometry, GeoJsonObject } from 'geojson';
import { Layer, GeoJSON as LeafletGeoJSON, PathOptions } from 'leaflet';

interface FeatureProperties {
    id: number;
    Id: number;
    nom: string;
    surface: number | string;
    surf_reel: number | string;
}

interface GeoJSONLayerProps {
    data: GeoJsonObject;
    style?: PathOptions; // Add a style prop
}

const GeoJSONLayer: React.FC<GeoJSONLayerProps> = ({ data, style }) => {
    console.log(data);
    const geoJsonLayerRef = useRef<LeafletGeoJSON>(null);

    const onEachFeature = (
        feature: Feature<Geometry, FeatureProperties>,
        layer: Layer
    ): void => {
        const { properties } = feature;
        console.log(properties);
        let idToUse = !!properties.id ? properties.id : properties.Id;
        if (properties && properties.nom && properties.surface) {
            const popupContent = `<strong><a href='/marketplace/${idToUse}'>${properties.nom}<a></strong><br/>Surface: ${Number(properties.surface).toFixed(2)} Ha`;
            layer.bindPopup(popupContent);
        }
    };

    useEffect(() => {
        if (geoJsonLayerRef.current) {
            const layer = geoJsonLayerRef.current;
            layer.clearLayers();
            layer.addData(data);
        }
    }, [data]);

    return (
        <GeoJSON
            data={data}
            onEachFeature={onEachFeature}
            ref={geoJsonLayerRef}
            style={style}
        />
    );
};

export default GeoJSONLayer;
