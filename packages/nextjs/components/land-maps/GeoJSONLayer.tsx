// src/GeoJSONLayer.tsx
import React, { useEffect, useRef } from 'react';
import { GeoJSON } from 'react-leaflet';
import { Feature, Geometry, GeoJsonObject } from 'geojson';
import { Layer, GeoJSON as LeafletGeoJSON } from 'leaflet';

interface FeatureProperties {
    nom: string;
    surface: number | string;
}

interface GeoJSONLayerProps {
    data: GeoJsonObject;
}

const GeoJSONLayer: React.FC<GeoJSONLayerProps> = ({ data }) => {
    const geoJsonLayerRef = useRef<LeafletGeoJSON>(null);

    const onEachFeature = (
        feature: Feature<Geometry, FeatureProperties>,
        layer: Layer
    ): void => {
        const { properties } = feature;

        if (properties && properties.nom && properties.surface) {
            const popupContent = `<strong>${properties.nom}</strong><br/>Surface: ${properties.surface}`;
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
        />
    );
};

export default GeoJSONLayer;
