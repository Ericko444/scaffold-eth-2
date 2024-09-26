"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import LandsTable from "../myLands/_components/LandsTable";


const Marketplace: NextPage = () => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();

    const { data: getLandsNotOwnedByAccount } = useScaffoldReadContract({
        contractName: "YourContract",
        functionName: "getLandsNotOwnedByAccount",
        args: [connectedAddress],
        watch: true,
    });

    console.log(getLandsNotOwnedByAccount);


    return (
        <>
            <div className="flex items-center flex-col pt-10">
                <div className="px-5">
                    <h1 className="text-center mb-8">
                        <span className="block text-4xl font-bold">Lands to sell</span>
                    </h1>
                </div>
            </div>
            <div className="flex justify-center">
                {!isConnected || isConnecting ? (
                    <RainbowKitCustomConnectButton />
                ) : <LandsTable lands={getLandsNotOwnedByAccount ?? []} />}
            </div>
        </>
    );
};

export default Marketplace;
