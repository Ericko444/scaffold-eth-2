import LandsTable, { Action } from "~~/app/myLands/_components/LandsTable";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import RequestsTable from "./RequestsTable";
import { useState } from "react";
import { Request } from "./RequestsTable";

interface ModalMyRequestsProps {
    request: Request | null,
}

export const ModalMyRequests = ({ request }: ModalMyRequestsProps) => {

    const { writeContractAsync, isPending } = useScaffoldWriteContract("LandRegistry");

    const handleAcceptExchange = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "acceptExchange",
                    args: [request?.id],
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

    if (!request) {
        return null;
    }
    return (
        <dialog id="modal_my_requests" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Exchange request :</h3>
                <p>Land 1 : {Number(request.landId1)}</p>
                <p>Land 2 : {Number(request.landId2)}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-primary" onClick={handleAcceptExchange}>Accept Exchange</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}