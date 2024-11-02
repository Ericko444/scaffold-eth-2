"use client";

import type { NextPage } from "next";
import React, { useEffect } from "react";
import MapViewGSON from "~~/components/land-maps/MapViewGSON";
import { geoData } from "./data/data2";
import { SearchDTO, SearchResponse } from "~~/types/search";
import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from 'axios';
import api from "~~/utils/api/api";
import { filterGeoJSONByIds, LandPropertiesSurf, parsePolygonGeometry, filterLandsArrayByIds } from "~~/utils/lands/lands";
import { FeatureCollection, Polygon } from "geojson";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Land } from "~~/types/land";
import GridCards from "~~/components/land-maps/GridCards";
import { useAppDispatch, useAppSelector } from "~~/lib/hooks";
import { selectChats } from "~~/lib/features/chat/discutionSlice";

const Explore: NextPage = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [responseData, setResponseData] = useState<SearchResponse | null>(null);
    const [geoDatas, setGeoDatas] = useState<FeatureCollection<Polygon, LandPropertiesSurf> | null>(geoData);
    const [lands, setLands] = useState<Land[] | undefined>([]);
    const dispatch = useAppDispatch();
    const chats = useAppSelector(selectChats);


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
        setLands(landsData)
        localStorage.setItem("marketLands", JSON.stringify(landsData));
    }, [getAllLands])


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
            <div className="flex h-screen">
                {/* Sidebar Chat */}
                <div className="w-1/4 bg-gray-100 flex flex-col border-r">
                    {/* Chat Header */}
                    <div className="p-5 border-b">
                        <h2 className="text-xl font-bold">Explore Data</h2>
                    </div>

                    {/* Chat Messages (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">

                        {/* <div className="chat chat-start">
                            <div className="chat-bubble">Hello! How can I assist you today?</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-bubble bg-blue-500 text-white">I’d like to compare GDP between the USA and Italy over the past five years.</div>
                        </div>
                        <div className="chat chat-start">
                            <div className="chat-bubble">Certainly! Let me prepare a comparison chart for that.</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-bubble bg-blue-500 text-white">Thank you! I also need insights on recent trends.</div>
                        </div>
                        <div className="chat chat-start">
                            <div className="chat-bubble">Sure, I'll provide you with that information shortly.</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-bubble bg-blue-500 text-white">Could you also add historical data for more context?</div>
                        </div>
                        <div className="chat chat-start">
                            <div className="chat-bubble">Absolutely! I’ll include data from the past decade.</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-bubble bg-blue-500 text-white">This is perfect. Can you make it a line chart instead?</div>
                        </div>
                        <div className="chat chat-start">
                            <div className="chat-bubble">No problem. Switching to a line chart now.</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-bubble bg-blue-500 text-white">Also, add some annotations for significant years.</div>
                        </div>
                        <div className="chat chat-start">
                            <div className="chat-bubble">Done! Adding annotations for key economic events.</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-bubble bg-blue-500 text-white">This is fantastic! Thank you for the quick assistance.</div>
                        </div>
                        <div className="chat chat-start">
                            <div className="chat-bubble">You're welcome! Let me know if there’s anything else.</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-bubble bg-blue-500 text-white">Actually, could we also add inflation rates for the same period?</div>
                        </div>
                        <div className="chat chat-start">
                            <div className="chat-bubble">Yes, I’ll add inflation rates for both countries in the chart.</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-bubble bg-blue-500 text-white">Amazing! Thank you once again.</div>
                        </div> */}
                    </div>

                    {/* Chat Input (Fixed at Bottom) */}
                    <form onSubmit={handleSubmit}>
                        <div className="p-5 border-t bg-white">
                            <input
                                type="text"
                                placeholder="Type a message"
                                className="input input-bordered w-full mb-2"
                                onChange={(e) => setPrompt(e.target.value)}
                                value={prompt}
                            />
                            <button className="btn btn-primary w-full">
                                Send
                            </button>
                        </div>
                    </form>

                </div>

                {/* Main Content */}
                <div className="flex-1 p-10 overflow-y-auto">
                    <div className="flex items-center flex-col">
                        <div className="px-5">
                            <h1 className="text-center mb-8">
                                <span className="block text-4xl font-bold">Explore lands</span>
                            </h1>
                        </div>
                        {/* <form className="w-full min-w-96 max-w-3xl mb-10" onSubmit={handleSubmit}>
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">What type of land are you searching for?</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="e.g.: Lands near roads"
                                    className="input input-bordered input-primary input-lg w-full"
                                    onChange={(e) => setPrompt(e.target.value)}
                                    value={prompt}
                                />
                            </label>
                            <button className="btn btn-primary btn-wide mt-5">Search</button>
                        </form> */}

                        <div className="flex items-center flex-col">
                            {!!geoDatas ? (
                                <MapViewGSON data={geoDatas} />
                            ) : (
                                <p>Loading map data...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>



    );
};

export default Explore;
