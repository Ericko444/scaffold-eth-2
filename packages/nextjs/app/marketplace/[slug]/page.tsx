"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import LandDetails from "~~/components/land-maps/LandDetails";
import MapView from "~~/components/land-maps/MapView";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Land } from "~~/types/land";
import { parsePolygonGeometry } from "~~/utils/lands/lands";

export default function Page({ params }: { params: { slug: string } }) {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const [land, setLand] = useState<Land[]>([]);

    console.log('SLUG', params.slug);

    const { data: getLandDetails } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getLandDetails",
        args: [BigInt(params.slug)],
        watch: true,
    });

    useEffect(() => {
        if (getLandDetails) {
            const parsedData = JSON.parse(getLandDetails.geometry);
            const geometryObject = parsedData.geometry;
            const landsData: Land = {
                ...getLandDetails,
                id: Number(getLandDetails.id),
                price: Number(getLandDetails.price),
                geometry: parsePolygonGeometry(geometryObject),
            };
            setLand([landsData]); // Set land as an array containing landsData
        } else {
            setLand([]); // Set land to an empty array if no data
        }
    }, [getLandDetails]);

    console.log(land); // Logs an array of Land objects
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-start mb-4">
                <button className="btn" onClick={() => { }}>
                    Back
                </button>
            </div>
            <div className="flex items-center flex-col pt-10">
                {!!land && land.length > 0 ? (
                    <MapView lands={land} />
                ) : (
                    <p>Loading map data...</p>
                )}

            </div>
            {!!land && land.length > 0 ? (
                <LandDetails land={land[0]} />
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    )
}