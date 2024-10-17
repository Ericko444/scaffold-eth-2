"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import ApprovalDetails from "~~/components/land-maps/ApprovalDetails";
import MapView from "~~/components/land-maps/MapView";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { selectExchanges } from "~~/lib/features/land/exchangeSlice";
import { useAppSelector } from "~~/lib/hooks";
import { Land, ExchangeRequestDTO } from "~~/types/land";

export default function Page({ params }: { params: { slug: string } }) {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const [lands, setLands] = useState<Land[]>([]);
    const [request, setRequest] = useState<Request | null>(null);
    const exchanges = useAppSelector(selectExchanges);
    console.log(exchanges);

    function filterById(items: ExchangeRequestDTO[], id: number): ExchangeRequestDTO[] {
        return items.filter(item => item.id === id);
    }

    const requestDt = filterById(exchanges, Number(params.slug));
    useEffect(() => {
        if (requestDt.length > 0 && !!requestDt[0].land1 && !!requestDt[0].land2) {
            setLands(lands.concat([requestDt[0].land1, requestDt[0].land2]));
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
                    functionName: "approveExchange",
                    args: [BigInt(requestDt[0].id)],
                    value: BigInt(requestDt[0].request.priceDifference)
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
                <ApprovalDetails lands={lands} request={requestDt[0].request} />
            ) : (
                <p>Loading data...</p>
            )}
            <div className="flex items-center flex-col pt-10">
                <button className="btn btn-neutral btn-lg" onClick={act}>Approve Exchange</button>
            </div>
            <dialog id="modal_my_lands" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirmation exchange</h3>
                    <p className="py-4">Do you want to approve this exchange?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-success" onClick={handleAcceptExchange}>Approve exchange</button>
                            <button className="btn btn-error ml-4">Deny</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )

}