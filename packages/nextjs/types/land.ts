import { Request, RequestItem } from "~~/app/myRequests/_components/RequestsTable";

export interface Land {
    id: number;
    num: string;
    nom: string;
    surface: string;
    surf_reel: string;
    price: number;
    geometry: PolygonGeometry
}

export interface ExchangeRequestDTO {
    id: number,
    land1: Land,
    land2: Land,
    request: RequestItem
}

type Position = [number, number];                // [longitude, latitude]
type LinearRing = Position[];                    // Array of positions
export type PolygonCoordinates = LinearRing[];          // Array of linear rings

export interface PolygonGeometry {
    type: 'Polygon';
    coordinates: PolygonCoordinates;
}