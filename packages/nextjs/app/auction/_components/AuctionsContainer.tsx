import { useState, useEffect } from "react";
import RequestsContainer from "~~/app/myRequests/_components/RequestsContainer";
import LandCard from "~~/components/land-maps/LandCard";
import RequestComponent from "~~/components/land-maps/RequestComponent";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { fetchRequest } from "~~/lib/features/land/exchangeSlice";
import { useAppDispatch } from "~~/lib/hooks";
import { Auction, Land } from "~~/types/land";
import { parsePolygonGeometry } from "~~/utils/lands/lands";

interface AuctionsContainerProps {
    auction: Auction | null,
    type: string
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
        // const requestItem = {
        //     ...request,
        //     id: Number(request.id),
        //     landId1: Number(request.landId1),
        //     landId2: Number(request.landId2),
        //     payerIndex: Number(request.payerIndex),// 1 for owner1, 2 for owner2
        //     priceDifference: Number(request.priceDifference),
        // }
        // dispatch(fetchRequest({ land1: lands[0], land2: lands[1], request: requestItem, id: Number(request.id) }));
        return (
            <div className="container mx-auto">
                <LandCard land={land} />
            </div>
        );
    }
    return null;
}

export default AuctionsContainer;