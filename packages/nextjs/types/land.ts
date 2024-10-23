import { Request, RequestItem } from "~~/app/myRequests/_components/RequestsTable";

export interface Land {
    id: number;
    num: string;
    nom: string;
    surface: string;
    surf_reel: string;
    price: number;
    geometry: PolygonGeometry;
    isForSale: boolean;
    seller: string
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

export interface Auction {
    landId: bigint; // Using bigint for uint256
    highestBidder: string; // Address is represented as a string
    highestBid: bigint; // Using bigint for uint256
    endTime: bigint; // Using bigint for uint256
    active: boolean;
    ended: boolean;
    isPending: boolean;
}

export interface AuctionItem {
    landId: number; // Using number for uint256
    highestBidder: string; // Address is represented as a string
    highestBid: number; // Using number for uint256
    endTime: number; // Using bigint for uint256
    active: boolean;
    ended: boolean;
    isPending: boolean;
}

export interface AuctionDTO {
    id: number,
    land: Land,
    auction: AuctionItem
}