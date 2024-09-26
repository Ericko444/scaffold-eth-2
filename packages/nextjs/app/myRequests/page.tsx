"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import RequestsTable, { Action } from "./_components/RequestsTable";


const MyLands: NextPage = () => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();

    const { data: getExchangeRequests } = useScaffoldReadContract({
        contractName: "YourContract",
        functionName: "getExchangeRequestsAsOwner2",
        args: [connectedAddress],
        watch: true,
    });

    console.log(getExchangeRequests);

    const act = () => {

    }

    const actions: Action[] = [
        {
            label: "Approve",
            action: act
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
                {!isConnected || isConnecting ? (
                    <RainbowKitCustomConnectButton />
                ) : <RequestsTable requests={getExchangeRequests ?? []} actions={actions} />}
            </div>
        </>
    );
};

export default MyLands;
