import LandsTable, { Action } from "~~/app/myLands/_components/LandsTable";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { MyLandsTable } from "./MyLandsTable";
import { useState } from "react";

export const ModalMyLands = () => {
    const [selectedLandId, setSelectedLandId] = useState<number>(0);
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();

    const { data: getLandsOfAccount } = useScaffoldReadContract({
        contractName: "YourContract",
        functionName: "getLandsOfAccount",
        args: [connectedAddress],
        watch: true,
    });

    const actions: Action[] = [
        {
            label: "Sell",
            action: () => { }
        }
    ];

    console.log(getLandsOfAccount);

    const { writeContractAsync, isPending } = useScaffoldWriteContract("YourContract");

    const handleRequestExchange = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "requestExchange",
                    args: [BigInt(selectedLandId), BigInt(2)],
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
        <dialog id="modal_my_lands" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Choose the land you want to exchange with this one :</h3>
                <div className="mt-5 mb-5">
                    <MyLandsTable lands={getLandsOfAccount ?? []} selectedLandId={selectedLandId} setSelectedLandId={setSelectedLandId} />
                </div>
                <button className="btn btn-primary" onClick={handleRequestExchange}>Validate</button>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}