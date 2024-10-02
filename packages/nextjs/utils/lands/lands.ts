import { Land, PolygonCoordinates, PolygonGeometry } from "~~/types/land";
import { Feature, FeatureCollection, Polygon } from 'geojson';

export interface LandProperties {
    id: number;
    num: string;
    nom: string;
    surface: string;
    surf_reel: string;
    price: number;
}

export function parsePolygonGeometry(input: any): PolygonGeometry {
    if (
        input &&
        input.type === 'Polygon' &&
        Array.isArray(input.coordinates) &&
        input.coordinates.every((ring: any) =>
            Array.isArray(ring) &&
            ring.every(
                (position: any) =>
                    Array.isArray(position) &&
                    position.length === 2 &&
                    typeof position[0] === 'number' &&
                    typeof position[1] === 'number'
            )
        )
    ) {
        const coordinates = input.coordinates as PolygonCoordinates;
        return {
            type: 'Polygon',
            coordinates: coordinates
        };
    } else {
        throw new Error('Invalid geometry data');
    }
}

export function convertIntoFeatureCollection(data: Land[]): FeatureCollection<Polygon, LandProperties> {
    const features: Feature<Polygon, LandProperties>[] = data.map((item) => {
        // Extract the geometry
        const geometry = item.geometry;

        // Extract the properties (excluding geometry)
        const { geometry: geom, ...properties } = item;

        // Create the GeoJSON Feature
        const feature: Feature<Polygon, LandProperties> = {
            type: 'Feature',
            geometry: geometry,
            properties: properties as LandProperties,
        };

        return feature;
    });

    const featureCollection: FeatureCollection<Polygon, LandProperties> = {
        type: 'FeatureCollection',
        features: features,
    };

    return featureCollection;
}