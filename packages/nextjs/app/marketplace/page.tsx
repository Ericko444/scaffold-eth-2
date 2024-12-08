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
import { filterGeoJSONByIds, filterLandsArrayByIds, LandPropertiesSurf, parsePolygonGeometry } from "~~/utils/lands/lands";
import LandCarousel from "~~/components/land-maps/LandCarousel";
import GridCards from "~~/components/land-maps/GridCards";
import Filter from "./_components/Filter";
import { SearchDTO, SearchResponse } from "~~/types/search";
import { AxiosError } from "axios";
import { FeatureCollection, Polygon } from "geojson";
import api from "~~/utils/api/api";
import { geoData } from "../explore/data/data2";


const Marketplace: NextPage = () => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const [lands, setLands] = useState<Land[] | undefined>([]);
    const [viewMode, setViewMode] = useState<string>("grid");

    const [prompt, setPrompt] = useState<string>('');
    const [responseData, setResponseData] = useState<SearchResponse | null>(null);
    const [geoDatas, setGeoDatas] = useState<FeatureCollection<Polygon, LandPropertiesSurf> | null>(geoData);

    const toggleViewMode = () => {
        setViewMode(viewMode === "grid" ? "map" : "grid");
    };

    const { data: getLandsForSale } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getLandsForSale",
        watch: true,
    });

    useEffect(() => {
        // const landsData: Land[] | undefined = getLandsForSale?.map(land => {
        //     const parsedData = JSON.parse(land.geometry);
        //     const geometryObject = parsedData.geometry;
        //     return { ...land, id: Number(land.id), price: Number(land.price), geometry: parsePolygonGeometry(geometryObject) }
        // });
        const landsData: Land[] | undefined = getLandsForSale
            ?.filter(land => land.seller !== connectedAddress)
            .map(land => {
                const parsedData = JSON.parse(land.geometry);
                const geometryObject = parsedData.geometry;
                return {
                    ...land,
                    id: Number(land.id),
                    price: Number(land.price),
                    geometry: parsePolygonGeometry(geometryObject)
                };
            });
        setLands(landsData)
        localStorage.setItem("marketLands", JSON.stringify(landsData));
    }, [getLandsForSale])



    const { writeContractAsync, isPending } = useScaffoldWriteContract("LandRegistry");

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
                        <span className="block text-4xl font-bold">Marketplace</span>
                    </h1>
                </div>
            </div>
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4 space-x-4">
                    {/* Filter on the Left */}
                    <div className="w-1/4">
                        <Filter />
                    </div>

                    {/* Search Bar in the Center */}
                    <input
                        type="text"
                        placeholder="Rechercher propriété"
                        className="input input-bordered flex-grow"
                    // onChange={(e) => handleSearch(e.target.value)}
                    />

                    {/* View Mode Toggle Button on the Right */}
                    <div className="w-1/4 flex justify-end">
                        <button className="btn" onClick={toggleViewMode}>
                            Switch to {viewMode === "grid" ? "Map" : "Grid"} View
                        </button>
                    </div>
                </div>

                {/* Filter and View Logic */}
                {viewMode === "grid" ? (
                    <div className="flex justify-between">
                        {/* Content for Grid View */}
                        {!!lands && lands.length > 0 ? (
                            <GridCards type="marketplace" lands={lands} />
                        ) : (
                            <p>Loading data...</p>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center flex-col pt-10">
                        {/* Content for Map View */}
                        {!!lands && lands.length > 0 ? (
                            <MapView lands={lands} />
                        ) : (
                            <p>Loading map data...</p>
                        )}
                    </div>
                )}
            </div>
        </>


    );
};

export default Marketplace;
