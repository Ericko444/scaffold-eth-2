import { Land } from "~~/types/land";
import { formatEther } from "viem";
import { ModalMyLands } from "~~/app/marketplace/_components/ModalMyLands";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Address } from "../scaffold-eth";
import { useGlobalState } from "~~/services/store/store";

interface LandDetailsProps {
    land: Land
}

const act = () => {
    const modal = document.getElementById('modal_my_lands') as HTMLDialogElement | null;

    if (modal) {
        modal.showModal();
    } else {
        console.error("Modal element not found");
    }
}

const act2 = () => {
    const modal = document.getElementById('modal_purchase') as HTMLDialogElement | null;

    if (modal) {
        modal.showModal();
    } else {
        console.error("Modal element not found");
    }
}




const LandDetails = ({ land }: LandDetailsProps) => {
    const { writeContractAsync, isPending } = useScaffoldWriteContract("LandRegistry");
    const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
    const formattedBalance = land.price ? Number(formatEther(BigInt(land.price))) : 0;
    const handlePurchase = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "purchaseLand",
                    args: [BigInt(land.id)],
                    value: BigInt(land.price)
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
    return (<div className="flex flex-col lg:flex-row bg-neutral text-neutral-content p-8 mt-20">
        <div className="w-full lg:w-2/3 space-y-4">
            <h1 className="text-4xl font-bold">{land.nom}</h1>
            <div className="badge badge-primary text-white p-3">{land.num}</div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="text-sm">No description</p>
            </div>

            <div className="flex items-center mt-4 space-x-2">
                <div>
                    <p className="font-semibold"><Address address={land.seller} /></p>
                </div>
            </div>
        </div>

        <div className="w-full lg:w-1/3 bg-black shadow-lg p-6 rounded-lg">
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{formatEther(BigInt(land.price))} ETH</span>
                <span className="text-sm text-gray-500">{(nativeCurrencyPrice * formattedBalance).toFixed(2)} $</span>
            </div>

            <div className="mt-6 space-y-3">
                <button className="btn btn-primary w-full text-white" onClick={act2}>ACHETER</button>
                <button className="btn bg-white w-full" onClick={act}>DEMANDER UNE ECHANGE</button>
            </div>

            <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                    <span className="font-semibold">Type</span>
                    <span>Land</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Network</span>
                    <span>ETHEREUM</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <span className="font-semibold">Propriétaire</span>
                    <div className="flex items-center space-x-2">
                        <p className="font-semibold"><Address address={land.seller} /></p>
                    </div>
                </div>
            </div>
        </div>
        <ModalMyLands idLandToExchange={land.id} />
        <dialog id="modal_purchase" className="modal modal-bottom sm:modal-middle text-black">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Confirmation buy</h3>
                <p className="py-4">Are you sure you want to buy this land for {formatEther(BigInt(land.price))} ETH?</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-success" onClick={handlePurchase}>Yes, Buy</button>
                        <button className="btn btn-error ml-4">Cancel</button>
                    </form>
                </div>
            </div>
        </dialog>
    </div>
    );
}

export default LandDetails;