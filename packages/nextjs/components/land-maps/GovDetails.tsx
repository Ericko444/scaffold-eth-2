import { Land } from "~~/types/land";
import { formatEther } from "viem";
import { ModalMyLands } from "~~/app/marketplace/_components/ModalMyLands";
import Link from "next/link";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { redirect, useRouter } from "next/navigation";
import { useGlobalState } from "~~/services/store/store";
import { Address } from "../scaffold-eth";
import { formatCurrency } from "~~/utils/balances/balances";

interface GovLandDetailsProps {
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

const GovLandDetails = ({ land }: GovLandDetailsProps) => {
    const { writeContractAsync, isPending } = useScaffoldWriteContract("LandRegistry");
    const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
    const formattedBalance = land.price ? Number(formatEther(BigInt(land.price))) : 0;
    const ariaryValue = useGlobalState(state => state.ariaryValue);
    const ariaryBalance = (nativeCurrencyPrice * formattedBalance * ariaryValue);
    const router = useRouter();
    const handleStartAuction = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "createAuction",
                    args: [BigInt(land.id)],
                },
                {
                    onBlockConfirmation: txnReceipt => {
                        console.log("📦 Transaction blockHash", txnReceipt.blockHash);
                        router.push('/auction');
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
                <p className="text-sm">Superficie: {parseFloat(land.surface.replace(",", ".")).toFixed(2)} Hectares</p>
                <p className="text-sm">...</p>
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
                <span className="text-sm text-gray-500">{formatCurrency(ariaryBalance, "Ar")} / {formatCurrency(nativeCurrencyPrice * formattedBalance, "$")}</span>
            </div>

            <div className="mt-6 space-y-3">
                <button className="btn bg-white w-full" onClick={handleStartAuction}>METTRE AUX ENCHERES</button>
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
    </div>
    );
}

export default GovLandDetails;