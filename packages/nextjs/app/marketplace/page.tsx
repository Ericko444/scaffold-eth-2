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

    const { data: getLandsNotOwnedByAccount } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getLandsForSale",
        watch: true,
    });

    useEffect(() => {
        const landsData: Land[] | undefined = getLandsNotOwnedByAccount?.map(land => {
            const parsedData = JSON.parse(land.geometry);
            const geometryObject = parsedData.geometry;
            return { ...land, id: Number(land.id), price: Number(land.price), geometry: parsePolygonGeometry(geometryObject) }
        });
        setLands(landsData)
        localStorage.setItem("marketLands", JSON.stringify(landsData));
    }, [getLandsNotOwnedByAccount])



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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const postData: SearchDTO = {
            prompt
        };
        try {

            const response = await api.post<SearchResponse>('/search', postData);
            console.log('Post successful:', response);
            setResponseData(response.data);
            let ids: string[] = []
            let tay = response.data;
            console.log(typeof tay);
            if (typeof tay === "string") {
                tay = tay.replace('\n', '');
                tay = JSON.parse(tay);
            }
            tay.map(res => {
                ids.push(res.num);
            });
            console.log(ids);
            const filter = filterGeoJSONByIds(geoData, ids);
            const filterLands = filterLandsArrayByIds(lands, ids);
            setGeoDatas(filter);
            setLands(filterLands);
            setPrompt('');
        } catch (err) {
            console.error('Error posting data:', err);
            const errorMessage = (err as AxiosError).message || 'An unexpected error occurred.';
        } finally {
        }
    };


    return (
        <>
            <div className="flex items-center flex-col pt-10">
                <div className="px-5">
                    <h1 className="text-center mb-8">
                        <span className="block text-4xl font-bold">Lands on sale</span>
                    </h1>
                </div>
            </div>
            <div className="container mx-auto p-4">
                <div className="flex justify-end mb-4">
                    <button className="btn" onClick={toggleViewMode}>
                        Switch to {viewMode === "grid" ? "Map" : "Grid"} View
                    </button>
                </div>
                <div className="flex justify-between">
                    <Filter />
                    <div className="flex items-center flex-col pt-10">
                        <form className="w-full min-w-96 max-w-3xl" onSubmit={handleSubmit}>
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">What type of land are you searching for?</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="e.g : Lands near roads"
                                    className="input input-bordered input-primar input-lg w-full"
                                    onChange={(e) => setPrompt(e.target.value)}
                                    value={prompt}
                                />
                            </label>
                            <button className="btn btn-primary btn-wide mt-5">Search</button>
                        </form>
                    </div>
                </div>
                {viewMode === "grid" ? (
                    <div className="flex justify-between">
                        {/* <div role="tabpanel" className="tab-content p-10">{!isConnected || isConnecting ? (
                            <RainbowKitCustomConnectButton />
                        ) : <LandsTable lands={getLandsNotOwnedByAccount ?? []} actions={actions} />}</div> */}
                        {!!lands && lands.length > 0 ? (
                            <GridCards type="marketplace" lands={lands} />
                        ) : (
                            <p>Loading data...</p>
                        )}
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

export default Marketplace;
