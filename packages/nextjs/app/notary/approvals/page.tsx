"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import RequestsTable, { Action, Request } from "~~/app/myRequests/_components/RequestsTable";
import { parseEther } from "viem";


const Approvals: NextPage = () => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();

    const { data: getExchangeRequests } = useScaffoldReadContract({
        contractName: "YourContract",
        functionName: "getRequestsWaitingForNotary",
        watch: true,
    });

    console.log(getExchangeRequests);

    const { writeContractAsync, isPending } = useScaffoldWriteContract("YourContract");

    const handleAcceptExchange = async (request: Request) => {
        try {
            await writeContractAsync(
                {
                    functionName: "approveExchange",
                    args: [request.id],
                    value: request.priceDifference
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

    const actions: Action[] = [
        {
            label: "Approve",
            action: (request: Request) => handleAcceptExchange(request)
        }
    ];


    return (
        <>
            <div className="flex items-center flex-col pt-10">
                <div className="px-5">
                    <h1 className="text-center mb-8">
                        <span className="block text-4xl font-bold">Transactions waiting for approvals</span>
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

export default Approvals;