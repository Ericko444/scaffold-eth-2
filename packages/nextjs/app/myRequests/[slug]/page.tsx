"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { ExchangeRequestDTO, Land } from "~~/types/land";
import { Request } from "../_components/RequestsTable";
import { parsePolygonGeometry } from "~~/utils/lands/lands";
import MapView from "~~/components/land-maps/MapView";
import RequestsContainer from "../_components/RequestsContainer";
import { useAppSelector } from "~~/lib/hooks";
import { selectExchangeById, selectExchanges } from "~~/lib/features/land/exchangeSlice";
import ExchangeDetails from "~~/components/land-maps/ExchangeDetails";
import { formatEther } from "viem";

export default function Page({ params }: { params: { slug: string } }) {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const [lands, setLands] = useState<Land[]>([]);
    const [request, setRequest] = useState<Request | null>(null);
    const exchanges = useAppSelector(selectExchanges);
    const [confMessage, setConfMessage] = useState<string>("");
    console.log(exchanges);

    function filterById(items: ExchangeRequestDTO[], id: number): ExchangeRequestDTO[] {
        return items.filter(item => item.id === id);
    }

    const requestOwners: string[] = [];

    const requestDt = filterById(exchanges, Number(params.slug));
    useEffect(() => {
        if (requestDt.length > 0 && !!requestDt[0].land1 && !!requestDt[0].land2) {
            setLands(lands.concat([requestDt[0].land1, requestDt[0].land2]));
            requestOwners[0] = requestDt[0].request.owner1 === connectedAddress ? "You" : requestDt[0].request.owner1;
            requestOwners[1] = requestDt[0].request.owner2 === connectedAddress ? "You" : requestDt[0].request.owner2;
            const payReceiverIndex = requestDt[0].request.payerIndex === 2 ? 1 : 2;
            const action = payReceiverIndex === 1 ? "pay" : "receive";
            const message = `Do you want to accept the offer and ${action} ${formatEther(BigInt(requestDt[0].request.priceDifference))} ?`
            setConfMessage(message);
        }
    }, [])

    const act = () => {
        const modal = document.getElementById('modal_my_lands') as HTMLDialogElement | null;

        if (modal) {
            modal.showModal();
        } else {
            console.error("Modal element not found");
        }
    }

    const { writeContractAsync, isPending } = useScaffoldWriteContract("LandRegistry");

    const handleAcceptExchange = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "acceptExchange",
                    args: [BigInt(requestDt[0].id)],
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


    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-start mb-4">
                <button className="btn" onClick={() => { }}>
                    Back
                </button>
            </div>
            <div className="flex items-center flex-col pt-10">
                <MapView lands={lands} />
            </div>
            {!!lands && lands.length > 0 ? (
                <ExchangeDetails lands={lands} request={requestDt[0].request} />
            ) : (
                <p>Loading data...</p>
            )}
            <dialog id="modal_my_lands" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirmation exchange</h3>
                    <p className="py-4">{confMessage}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-success" onClick={handleAcceptExchange}>Accept offer</button>
                            <button className="btn btn-error ml-4">Deny</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <div className="flex items-center flex-col pt-10">
                <button className="btn btn-neutral btn-lg" onClick={act}>Accept offer</button>
            </div>
        </div>
    )

}