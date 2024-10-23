"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { useState } from "react";
import AuctionsContainer from "./_components/AuctionsContainer";


const Auctions: NextPage = () => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const { data: getAuctions } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getAllAuctions",
        watch: true,
    });

    console.log(getAuctions);
    return (
        <>
            <div className="flex items-center flex-col pt-10">
                <div className="px-5">
                    <h1 className="text-center mb-8">
                        <span className="block text-4xl font-bold">Auctions</span>
                    </h1>
                </div>
            </div>
            {!!getAuctions && (
                getAuctions.map(auct => (
                    <AuctionsContainer auction={auct} type="owner2" />
                ))
            )}

        </>
    );
};

export default Auctions;
