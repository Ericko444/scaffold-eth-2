import { Land } from "~~/types/land";
import { formatEther } from "viem";
import { ModalMyLands } from "~~/app/marketplace/_components/ModalMyLands";
import Link from "next/link";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface MyLandDetailsProps {
    land: Land
}


const act = () => {
    const modal = document.getElementById('modal_purchase') as HTMLDialogElement | null;

    if (modal) {
        modal.showModal();
    } else {
        console.error("Modal element not found");
    }
}

const MyLandDetails = ({ land }: MyLandDetailsProps) => {
    const { writeContractAsync, isPending } = useScaffoldWriteContract("LandRegistry");
    const handleUnlist = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "unlistLand",
                    args: [BigInt(land.id)],
                    // args: [land?.id, geometryStrings, ["0x7622b05c1cD2fC41a1C65D2Cee5C6CECbe0d23A7", "0x6A647c3c0cC1C267e18A96b68A0D98c48F0Ab3e3"]],
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

    const handleList = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "listLandForSale",
                    args: [BigInt(land.id), BigInt(land.price)],
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

    const handlePurchase = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "listLandForSale",
                    args: [BigInt(land.id), BigInt(land.price)],
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
    return (<div className="flex flex-col lg:flex-row bg-neutral text-neutral-content p-8 mt-20 rounded-lg">
        <div className="w-full lg:w-2/3 space-y-4">
            <h1 className="text-4xl font-bold">{land.nom}</h1>
            <div className="badge badge-primary text-white p-3">{land.num}</div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="text-sm">No description</p>
            </div>

            <div className="flex items-center mt-4 space-x-2">
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        <img src="https://via.placeholder.com/48" alt="Owner Avatar" />
                    </div>
                </div>
                <div>
                    <p className="font-semibold">{land.seller}</p>
                </div>
            </div>
        </div>

        <div className="w-full lg:w-1/3 bg-black shadow-lg p-6 rounded-lg">
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{formatEther(BigInt(land.price))} ETH</span>
                <span className="text-sm text-gray-500">($7,072.06)</span>
            </div>

            <div className="mt-6 space-y-3">
                <Link className="btn btn-primary w-full text-white" href={`/myLands/divide/${land.id}`}>DIVIDE</Link>
                {land.isForSale ? (<button className="btn bg-white w-full" onClick={handleUnlist}>UNLIST FOR SALE</button>) : (<button className="btn bg-white w-full" onClick={handleList}>LIST FOR SALE</button>)}
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
            </div>
        </div>
        <dialog id="modal_purchase" className="modal modal-bottom sm:modal-middle">
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

export default MyLandDetails;