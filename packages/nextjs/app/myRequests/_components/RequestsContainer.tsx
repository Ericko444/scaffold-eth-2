import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Request } from "./RequestsTable";
import { useEffect, useState } from "react";
import { Land } from "~~/types/land";
import { parsePolygonGeometry } from "~~/utils/lands/lands";
import RequestComponent from "~~/components/land-maps/RequestComponent";
import { useAppDispatch } from "~~/lib/hooks";
import { fetchRequest } from "~~/lib/features/land/exchangeSlice";

interface RequestsContainerProps {
    request: Request | null,
    type: string
}

const RequestsContainer = ({ request, type }: RequestsContainerProps) => {
    const [lands, setLands] = useState<Land[]>([]);
    const dispatch = useAppDispatch();

    const { data: getLand1 } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getLandDetails",
        args: [request.landId1],
        watch: true,
    });
    const { data: getLand2 } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getLandDetails",
        args: [request.landId2],
        watch: true,
    });

    useEffect(() => {
        if (getLand1) {
            const parsedData = JSON.parse(getLand1.geometry);
            const geometryObject = parsedData.geometry;
            const landsData: Land = {
                ...getLand1,
                id: Number(getLand1.id),
                price: Number(getLand1.price),
                geometry: parsePolygonGeometry(geometryObject),
            };
            setLands(lands?.concat(landsData)); // Set land as an array containing landsData
        }

        if (getLand2) {
            const parsedData = JSON.parse(getLand2.geometry);
            const geometryObject = parsedData.geometry;
            const landsData: Land = {
                ...getLand2,
                id: Number(getLand2.id),
                price: Number(getLand2.price),
                geometry: parsePolygonGeometry(geometryObject),
            };
            setLands(lands?.concat(landsData)); // Set land as an array containing landsData
        }
    }, [request, getLand1, getLand2]);

    if (!!request && lands.length > 0 && !!lands[0] && !!lands[1]) {
        const requestItem = {
            ...request,
            id: Number(request.id),
            landId1: Number(request.landId1),
            landId2: Number(request.landId2),
            payerIndex: Number(request.payerIndex),// 1 for owner1, 2 for owner2
            priceDifference: Number(request.priceDifference),
        }
        dispatch(fetchRequest({ land1: lands[0], land2: lands[1], request: requestItem, id: Number(request.id) }));
        return (
            <div className="container mx-auto">
                <RequestComponent land1={lands[0]} land2={lands[1]} id={request.id} type={type} />
            </div>
        );
    }
    return (
        <div className="flex justify-center">
            <p>No requests</p>
        </div>
    );
}

export default RequestsContainer;