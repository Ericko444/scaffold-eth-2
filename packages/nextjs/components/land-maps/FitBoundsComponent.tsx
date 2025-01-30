import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoJsonObject } from 'geojson';
import L from 'leaflet';

interface FitBoundsComponentProps {
    data: GeoJsonObject;
}

const FitBoundsComponent: React.FC<FitBoundsComponentProps> = ({ data }) => {
    const map = useMap();

    useEffect(() => {
        if (data) {
            const geoJsonLayer = L.geoJSON(data);
            const bounds = geoJsonLayer.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds);
            }
        }
    }, [map, data]);

    return null;
};

export default FitBoundsComponent;