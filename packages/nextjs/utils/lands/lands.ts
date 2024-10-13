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

export interface LandPropertiesSurf {
    Id: number;
    num: string;
    nom: string;
    surface: number;
    surf_reel: string | null;
}

export function parsePolygonGeometry(input: any): PolygonGeometry {
    if (
        input &&
        input.type === 'Polygon' &&
        Array.isArray(input.coordinates) &&
        input.coordinates.every((ring: any, ringIndex: number) => {
            if (!Array.isArray(ring)) {
                console.error(`Ring at index ${ringIndex} is not an array.`);
                return false;
            }
            return ring.every(
                (position: any, posIndex: number) => {
                    if (!Array.isArray(position)) {
                        console.error(`Position at index ${posIndex} in ring ${ringIndex} is not an array.`);
                        return false;
                    }
                    if (position.length !== 2) {
                        console.error(`Position at index ${posIndex} in ring ${ringIndex} does not have 2 elements.`);
                        return false;
                    }
                    if (typeof position[0] !== 'number' || typeof position[1] !== 'number') {
                        console.error(`Invalid number types at position ${posIndex} in ring ${ringIndex}:`, position);
                        return false;
                    }
                    return true;
                }
            );
        })
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

export function filterGeoJSONByIds(
    data: FeatureCollection<Polygon, LandPropertiesSurf>,
    ids: string[]
): FeatureCollection<Polygon, LandPropertiesSurf> {
    const filteredFeatures = data.features.filter((feature) => {
        return feature.properties && ids.includes(feature.properties.num);
    });
    return {
        type: 'FeatureCollection',
        features: filteredFeatures,
    };
}