"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import RequestsTable, { Action, Request } from "./_components/RequestsTable";
import { ModalMyRequests } from "./_components/ModalMyRequests";
import { useState } from "react";
import RequestsContainer from "./_components/RequestsContainer";


const MyRequests: NextPage = () => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const [requestId, setRequestId] = useState<Request | null>(null);

    const { data: getExchangeRequests } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getExchangeRequestsAsOwner2",
        args: [connectedAddress],
        watch: true,
    });

    const actions: Action[] = [
        {
            label: "See details",
            action: (request: Request) => {
                setRequestId(request);
                const modal = document.getElementById('modal_my_requests') as HTMLDialogElement | null;

                if (modal) {
                    modal.showModal();
                } else {
                    console.error("Modal element not found");
                }
            }
        }
    ];

    return (
        <>
            <div className="flex items-center flex-col pt-10">
                <div className="px-5">
                    <h1 className="text-center mb-8">
                        <span className="block text-4xl font-bold">Liste de mes demandes</span>
                    </h1>
                </div>
            </div>
            {/* <div className="flex justify-center">
                {!isConnected || isConnecting ? (
                    <RainbowKitCustomConnectButton />
                ) : <RequestsTable requests={getExchangeRequests ?? []} actions={actions} />}
            </div> */}
            {!!getExchangeRequests && (
                getExchangeRequests.map(req => (
                    <RequestsContainer request={req} type="owner2" />
                ))
            )}
            <ModalMyRequests request={requestId} />
        </>
    );
};

export default MyRequests;
