import { FeatureCollection, Point, Polygon } from "geojson";

export const geoDataPoints: FeatureCollection<Point, any> = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    47.03757,
                    -19.899004
                ]
            },
            "properties": {
                "type": "random_point_near_polygon"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    47.048684,
                    -19.845292
                ]
            },
            "properties": {
                "type": "random_point_near_polygon"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    47.043076,
                    -19.897277
                ]
            },
            "properties": {
                "type": "random_point_near_polygon"
            }
        }
    ]
}