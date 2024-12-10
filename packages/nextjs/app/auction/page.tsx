"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { useState } from "react";
import AuctionsContainer from "./_components/AuctionsContainer";
import Link from "next/link";


const Auctions: NextPage = () => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const { data: getAuctions } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getAllAuctions",
        watch: true,
    });

    return (
        <>
            <div className="flex items-center flex-col pt-10">
                <div className="px-5">
                    <h1 className="text-center mb-8">
                        <span className="block text-4xl font-bold">Propriétés en vente aux enchères</span>
                    </h1>
                </div>
            </div>
            <div className="container mx-auto p-4">
                <div className="grid gap-6 gap-y-10 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                    {!!getAuctions && (
                        getAuctions.map(auct => (
                            <Link href={`/auction/${auct.landId}`}>
                                <AuctionsContainer auction={auct} type="owner2" />
                            </Link>
                        ))
                    )}
                </div>
            </div>


        </>
    );
};

export default Auctions;
