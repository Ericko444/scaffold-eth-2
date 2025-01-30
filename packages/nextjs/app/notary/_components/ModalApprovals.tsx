import LandsTable, { Action } from "~~/app/myLands/_components/LandsTable";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useState } from "react";
import { Request } from "~~/app/myRequests/_components/RequestsTable";

interface ModalApprovalsProps {
    request: Request | null,
}

export const ModalApprovals = ({ request }: ModalApprovalsProps) => {

    const { writeContractAsync, isPending } = useScaffoldWriteContract("LandRegistry");

    const handleAcceptExchange = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "approveExchange",
                    args: [request?.id],
                    value: request?.priceDifference
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
        <dialog id="modal_approvals" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Exchange request :</h3>
                <p>Land 1 : {Number(request.landId1)}</p>
                <p>Land 2 : {Number(request.landId2)}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-primary" onClick={handleAcceptExchange}>Approve Exchange</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}