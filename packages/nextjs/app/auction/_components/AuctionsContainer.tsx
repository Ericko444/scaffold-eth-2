import { useState, useEffect } from "react";
import RequestsContainer from "~~/app/myRequests/_components/RequestsContainer";
import LandCard from "~~/components/land-maps/LandCard";
import LandCardAuction from "~~/components/land-maps/LandCardAuction";
import RequestComponent from "~~/components/land-maps/RequestComponent";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { fetchAuction } from "~~/lib/features/land/auctionSlice";
import { fetchRequest } from "~~/lib/features/land/exchangeSlice";
import { useAppDispatch } from "~~/lib/hooks";
import { Auction, AuctionItem, Land } from "~~/types/land";
import { parsePolygonGeometry } from "~~/utils/lands/lands";

interface AuctionsContainerProps {
    auction: Auction | null,
    type: string
}

function auctionToAuctionItem(auction: Auction): AuctionItem {
    return {
        landId: Number(auction.landId),
        highestBidder: auction.highestBidder,
        highestBid: Number(auction.highestBid),
        endTime: Number(auction.endTime),
        active: auction.active,
        ended: auction.ended,
        isPending: auction.isPending,
    };
}

const AuctionsContainer = ({ auction, type }: AuctionsContainerProps) => {
    const [land, setLand] = useState<Land>();
    const dispatch = useAppDispatch();

    const { data: getLand } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getLandDetails",
        args: [auction.landId],
        watch: true,
    });


    useEffect(() => {
        if (getLand) {
            const parsedData = JSON.parse(getLand.geometry);
            const geometryObject = parsedData.geometry;
            const landsData: Land = {
                ...getLand,
                id: Number(getLand.id),
                price: Number(getLand.price),
                geometry: parsePolygonGeometry(geometryObject),
            };
            setLand(landsData); // Set land as an array containing landsData
        }

    }, [auction, getLand]);

    if (!!auction && !!land) {
        dispatch(fetchAuction({ id: land.id, land: land, auction: auctionToAuctionItem(auction) }));
        return (
            <div className="container mx-auto">
                <LandCardAuction land={land} auction={auctionToAuctionItem(auction)} />
            </div>
        );
    }
    return null;
}

export default AuctionsContainer;