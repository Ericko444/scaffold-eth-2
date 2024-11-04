import LandsTable, { Action } from "~~/app/myLands/_components/LandsTable";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { MyLandsTable } from "./MyLandsTable";
import { useState } from "react";

interface ModalMyLandsProps {
    idLandToExchange: number
}

export const ModalMyLands = ({ idLandToExchange }: ModalMyLandsProps) => {
    const [selectedLandId, setSelectedLandId] = useState<number>(0);
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();

    const { data: getLandsOfAccount } = useScaffoldReadContract({
        contractName: "LandRegistry",
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

    const { writeContractAsync, isPending } = useScaffoldWriteContract("LandRegistry");

    const handleRequestExchange = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "requestExchange",
                    args: [BigInt(selectedLandId), BigInt(idLandToExchange)],
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
        <dialog id="modal_my_lands" className="modal text-black">
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Veuillez choisir le terrain que vous voulez échanger :</h3>
                <div className="mt-5 mb-5">
                    <MyLandsTable lands={getLandsOfAccount ?? []} selectedLandId={selectedLandId} setSelectedLandId={setSelectedLandId} />
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-primary" onClick={handleRequestExchange}>Valider</button>
                        <button className="btn btn-error ml-4">Cancel</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}