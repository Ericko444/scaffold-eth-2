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


const MyLands: NextPage = () => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const [landItem, setLandItem] = useState<Land | null>(null);
    const [lands, setLands] = useState<LandType[] | undefined>([]);
    const [landsDataD, setLandsDataD] = useState<LandType[] | undefined>([]);

    const { data: getLandsOfAccount } = useScaffoldReadContract({
        contractName: "YourContract",
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
                        <span className="block text-4xl font-bold">My Lands</span>
                    </h1>
                </div>
            </div>
            <div className="flex justify-center">
                <div role="tablist" className="tabs tabs-bordered">
                    <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Tableau" />
                    <div role="tabpanel" className="tab-content p-10">{!isConnected || isConnecting ? (
                        <RainbowKitCustomConnectButton />
                    ) : <LandsTable lands={getLandsOfAccount ?? []} actions={actions} />}</div>

                    <input
                        type="radio"
                        name="my_tabs_1"
                        role="tab"
                        className="tab"
                        aria-label="Carousel"
                        defaultChecked />
                    <div role="tabpanel" className="tab-content p-10">Tab content 2</div>
                </div>
            </div>
            <div className="flex items-center flex-col pt-10">
                {!!lands && lands.length > 0 ? (
                    <MapView lands={lands} />
                ) : (
                    <p>Loading map data...</p>
                )}

            </div>
            <ModalDivide land={landItem} />
        </>
    );
};

export default MyLands;
