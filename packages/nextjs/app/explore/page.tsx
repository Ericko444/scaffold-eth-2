"use client";

import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import MapViewGSON from "~~/components/land-maps/MapViewGSON";
import { geoData } from "./data/data2";
import { SearchDTO, SearchDTOWithData, SearchResponse } from "~~/types/search";
import axios, { AxiosError } from 'axios';
import api from "~~/utils/api/api";
import { filterGeoJSONByIds, LandPropertiesSurf, parsePolygonGeometry, filterLandsArrayByIds } from "~~/utils/lands/lands";
import { FeatureCollection, Polygon } from "geojson";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Land } from "~~/types/land";
import GridCards from "~~/components/land-maps/GridCards";
import { useAppDispatch, useAppSelector } from "~~/lib/hooks";
import { fetchChat, selectChats } from "~~/lib/features/chat/discutionSlice";
import { ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";

function generateRandomId(): number {
    return Math.floor(Math.random() * 9999) + 1;
}

const Explore: NextPage = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [responseData, setResponseData] = useState<SearchResponse | null>(null);
    const [geoDatas, setGeoDatas] = useState<FeatureCollection<Polygon, LandPropertiesSurf> | null>(geoData);
    const [lands, setLands] = useState<Land[] | undefined>([]);
    const [loading, setLoading] = useState<boolean>(false); // New loading state
    const dispatch = useAppDispatch();
    const chats = useAppSelector(selectChats);
    const [dataIds, setDataIds] = useState<string[]>([]);
    const [contexts, setContexts] = useState<string[]>([]);

    console.log("CHATS", chats);

    const { data: getAllLands } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getLandsForSale",
        watch: true,
    });

    useEffect(() => {
        const landsData: Land[] | undefined = getAllLands?.map(land => {
            const parsedData = JSON.parse(land.geometry);
            const geometryObject = parsedData.geometry;
            return { ...land, id: Number(land.id), price: Number(land.price), geometry: parsePolygonGeometry(geometryObject) }
        });
        setLands(landsData);
        localStorage.setItem("marketLands", JSON.stringify(landsData));
    }, [getAllLands]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try {
            const postData: SearchDTO = {
                prompt
            };
            const postDataSearch: SearchDTOWithData = {
                prompt,
                data: dataIds,
                contexts: contexts
            };
            const response = !!dataIds && dataIds.length > 0 ? await api.post<SearchResponse>('/searchData', postDataSearch) : await api.post<SearchResponse>('/search', postData);
            console.log('Post successful:', response);
            setResponseData(response.data);
            let ids: string[] = []
            let tay = response.data;
            console.log(typeof tay);
            if (typeof tay === "string") {
                tay = tay.replace('\n', '');
                tay = JSON.parse(tay);
            }
            tay.terrains.map(res => {
                ids.push(res.num);
            });
            setContexts(tay.usedData);
            setDataIds(ids);
            console.log(ids);
            dispatch(fetchChat({ prompt, data: ids, response: tay.contexte, id: generateRandomId() }));
            const filter = filterGeoJSONByIds(geoData, ids);
            const filterLands = filterLandsArrayByIds(lands, ids);
            setGeoDatas(filter);
            setLands(filterLands);
            setPrompt('');
        } catch (err) {
            console.error('Error posting data:', err);
            const errorMessage = (err as AxiosError).message || 'An unexpected error occurred.';
        } finally {
            setLoading(false); // Set loading to false after the API call completes
        }
    };

    return (
        <>
            <div className="flex h-screen">
                {/* Sidebar Chat */}
                <div className="w-1/4 bg-gray-100 flex flex-col border-r">
                    {/* Chat Header */}
                    <div className="p-5 border-b flex items-center">
                        <h2 className="text-xl font-bold flex-grow">Explorer les terrains</h2>
                        <div className="flex space-x-2">
                            <button className="btn btn-sm btn-primary flex items-center">
                                <ArrowPathIcon className="w-5 h-5 mr-1" />
                                Réinitialiser
                            </button>
                            {/* <button className="btn btn-sm btn-primary flex items-center">
                                <ClockIcon className="w-5 h-5 mr-1" />
                                History
                            </button> */}
                        </div>
                    </div>

                    {/* Chat Messages (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {chats.map((item) => (
                            <div key={item.id}>
                                <div className="chat chat-end">
                                    <div className="chat-bubble bg-blue-500 text-white">{item.prompt}</div>
                                </div>
                                <div className="chat chat-start">
                                    <div className="chat-bubble">{item.response}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input (Fixed at Bottom) */}
                    <form onSubmit={handleSubmit}>
                        <div className="p-5 border-t bg-white">
                            <input
                                type="text"
                                placeholder="Que recherchez-vous?"
                                className="input input-bordered w-full mb-2"
                                onChange={(e) => setPrompt(e.target.value)}
                                value={prompt}
                            />
                            <div className="flex space-x-2">
                                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                                    {loading ? "Loading..." : "Envoyer"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning flex-1"
                                    onClick={() => setPrompt('')}
                                >
                                    Effacer
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-10 overflow-y-auto relative overflow-x-hidden">
                    <div className="flex items-center flex-col">
                        <div className="px-5">
                            <h1 className="text-center mb-8">
                                <span className="block text-4xl font-bold">Explore lands</span>
                            </h1>
                        </div>
                        <div className="relative w-full h-full">
                            <div className={`w-full h-full ${loading ? 'blur-sm' : ''}`}>
                                <MapViewGSON data={geoDatas} contexts={contexts} />
                                <span className="loading loading-spinner loading-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none text-primary"></span>
                            </div>
                            {loading && (
                                <span className="loading loading-spinner loading-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"></span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Explore;
