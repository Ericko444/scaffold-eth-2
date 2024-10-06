"use client";

import type { NextPage } from "next";
import React, { } from "react";
import MapViewGSON from "~~/components/land-maps/MapViewGSON";
import { geoData } from "./data/data2";
import { SearchDTO, SearchResponse } from "~~/types/search";
import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from 'axios';
import api from "~~/utils/api/api";
import { filterGeoJSONByIds, LandPropertiesSurf } from "~~/utils/lands/lands";
import { FeatureCollection, Polygon } from "geojson";

const Explore: NextPage = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [responseData, setResponseData] = useState<SearchResponse | null>(null);
    const [geoDatas, setGeoDatas] = useState<FeatureCollection<Polygon, LandPropertiesSurf> | null>(geoData);
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
            setGeoDatas(filter);
            console.log(filter);
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
                        <span className="block text-4xl font-bold">Explore lands</span>
                    </h1>
                </div>
            </div>
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
            <div className="flex items-center flex-col pt-10">
                {/* <MapViewGSON data={geoDatas} /> */}
                {!!geoDatas ? (
                    <MapViewGSON data={geoDatas} />
                ) : (
                    <p>Loading map data...</p>
                )}
            </div>
        </>
    );
};

export default Explore;
