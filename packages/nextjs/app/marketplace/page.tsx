"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import LandsTable, { Action } from "../myLands/_components/LandsTable";
import { ModalMyLands } from "~~/app/marketplace/_components/ModalMyLands";
import React from "react";
import MapView from "./_components/MapView";


const Marketplace: NextPage = () => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();

    const { data: getLandsNotOwnedByAccount } = useScaffoldReadContract({
        contractName: "YourContract",
        functionName: "getLandsNotOwnedByAccount",
        args: [connectedAddress],
        watch: true,
    });

    console.log(getLandsNotOwnedByAccount);

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
                {!isConnected || isConnecting ? (
                    <RainbowKitCustomConnectButton />
                ) : <LandsTable lands={getLandsNotOwnedByAccount ?? []} actions={actions} />}
            </div>
            <div className="flex items-center flex-col pt-10">
                <MapView />
            </div>
            <ModalMyLands />
        </>
    );
};

export default Marketplace;
