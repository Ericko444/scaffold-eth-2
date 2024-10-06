"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import LandsTable, { Action } from "../myLands/_components/LandsTable";
import { ModalMyLands } from "~~/app/marketplace/_components/ModalMyLands";
import React, { useEffect, useState } from "react";
import MapView from "~~/components/land-maps/MapView";
import { Land } from "~~/types/land";
import { parsePolygonGeometry } from "~~/utils/lands/lands";
import LandCarousel from "~~/components/land-maps/LandCarousel";


const Marketplace: NextPage = () => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const [lands, setLands] = useState<Land[] | undefined>([]);

    const { data: getLandsNotOwnedByAccount } = useScaffoldReadContract({
        contractName: "YourContract",
        functionName: "getLandsNotOwnedByAccount",
        args: [connectedAddress],
        watch: true,
    });

    useEffect(() => {
        const landsData: Land[] | undefined = getLandsNotOwnedByAccount?.map(land => {
            const parsedData = JSON.parse(land.geometry);
            const geometryObject = parsedData.geometry;
            return { ...land, id: Number(land.id), price: Number(land.price), geometry: parsePolygonGeometry(geometryObject) }
        });
        setLands(landsData)
    }, [getLandsNotOwnedByAccount])



    const { writeContractAsync, isPending } = useScaffoldWriteContract("YourContract");

    const handleRequestExchange = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "requestExchange",
                    args: [BigInt(1), BigInt(2)],
                },
                {
                    onBlockConfirmation: txnReceipt => {
                        console.log("📦 Transaction blockHash", txnReceipt.blockHash);
                    },
                },
            );
        } catch (e) {
            console.error("Error requesting exchange", e);
        }
    };

    const act = () => {
        const modal = document.getElementById('modal_my_lands') as HTMLDialogElement | null;

        if (modal) {
            modal.showModal();
        } else {
            console.error("Modal element not found");
        }
    }

    const actions: Action[] = [
        {
            label: "Exchange",
            action: act
        }
    ];


    return (
        <>
            <div className="flex items-center flex-col pt-10">
                <div className="px-5">
                    <h1 className="text-center mb-8">
                        <span className="block text-4xl font-bold">Lands on sale</span>
                    </h1>
                </div>
            </div>
            <div className="flex justify-center">
                <div role="tablist" className="tabs tabs-bordered">
                    <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Tableau" defaultChecked />
                    <div role="tabpanel" className="tab-content p-10">{!isConnected || isConnecting ? (
                        <RainbowKitCustomConnectButton />
                    ) : <LandsTable lands={getLandsNotOwnedByAccount ?? []} actions={actions} />}</div>

                    <input
                        type="radio"
                        name="my_tabs_1"
                        role="tab"
                        className="tab"
                        aria-label="Carousel"
                    />
                    <div role="tabpanel" className="tab-content p-10">
                        {!!lands && lands.length > 0 ? (
                            <LandCarousel lands={lands} />
                        ) : (
                            <p>Loading map data...</p>
                        )}</div>
                </div>
            </div>
            <div className="flex items-center flex-col pt-10">
                {!!lands && lands.length > 0 ? (
                    <MapView lands={lands} />
                ) : (
                    <p>Loading map data...</p>
                )}

            </div>
            <ModalMyLands />
        </>
    );
};

export default Marketplace;
