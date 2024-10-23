"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import LandsTable, { Action } from "./_components/LandsTable";
import { useEffect, useState } from "react";
import { Land } from "./_components/LandsTable";
import { ModalDivide } from "./_components/ModalDivide";
import React from "react";
import { Land as LandType } from "~~/types/land";
import MapView from "~~/components/land-maps/MapView";
import { parsePolygonGeometry } from "~~/utils/lands/lands";
import { geojsonData, simpleData } from "~~/data/data";
import LandCarousel from "~~/components/land-maps/LandCarousel";
import GridCards from "~~/components/land-maps/GridCards";


const MyLands: NextPage = () => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const [landItem, setLandItem] = useState<Land | null>(null);
    const [lands, setLands] = useState<LandType[] | undefined>([]);
    const [landsDataD, setLandsDataD] = useState<LandType[] | undefined>([]);
    const [viewMode, setViewMode] = useState<string>("grid");

    const toggleViewMode = () => {
        setViewMode(viewMode === "grid" ? "map" : "grid");
    };

    const { data: getLandsOfAccount } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getLandsOfAccount",
        args: [connectedAddress],
        watch: true,
    });

    useEffect(() => {
        const landsData: LandType[] | undefined = getLandsOfAccount?.map(land => {
            const parsedData = JSON.parse(land.geometry);
            const geometryObject = parsedData.geometry;
            return { ...land, id: Number(land.id), price: Number(land.price), geometry: parsePolygonGeometry(geometryObject) }
        });
        setLands(landsData);
        setLandsDataD(landsData);
    }, [getLandsOfAccount])

    console.log(lands);

    const act = () => {

    }

    const actions: Action[] = [
        {
            label: "Sell",
            action: act
        },
        {
            label: "Divide",
            action: (land: Land) => {
                setLandItem(land);
                const modal = document.getElementById('modal_divide') as HTMLDialogElement | null;

                if (modal) {
                    modal.showModal();
                } else {
                    console.error("Modal element not found");
                }
            }
        }
    ];


    return (
        <>
            <div className="flex items-center flex-col pt-10">
                <div className="px-5">
                    <h1 className="text-center mb-8">
                        <span className="block text-4xl font-bold">Government's lands</span>
                    </h1>
                </div>
            </div>
            <div className="container mx-auto p-4">
                <div className="flex justify-end mb-4">
                    <button className="btn" onClick={toggleViewMode}>
                        Switch to {viewMode === "grid" ? "Map" : "Grid"} View
                    </button>
                </div>
                {viewMode === "grid" ? (
                    <div className="flex justify-center">
                        {/* <div role="tabpanel" className="tab-content p-10">{!isConnected || isConnecting ? (
                            <RainbowKitCustomConnectButton />
                        ) : <LandsTable lands={getLandsNotOwnedByAccount ?? []} actions={actions} />}</div> */}
                        <GridCards type="gov" lands={getLandsOfAccount ?? []} />
                    </div>
                ) : (
                    <div className="flex items-center flex-col pt-10">
                        {!!lands && lands.length > 0 ? (
                            <MapView lands={lands} />
                        ) : (
                            <p>Loading map data...</p>
                        )}

                    </div>
                )
                }
            </div>
        </>
    );
};

export default MyLands;
