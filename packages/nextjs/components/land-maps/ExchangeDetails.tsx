import { Land } from "~~/types/land";
import { formatEther } from "viem";
import { ModalMyLands } from "~~/app/marketplace/_components/ModalMyLands";
import { RequestItem } from "~~/app/myRequests/_components/RequestsTable";
import { useAccount } from "wagmi";
import { Address } from "../scaffold-eth";
import { useGlobalState } from "~~/services/store/store";

interface ExchangeDetailsProps {
    lands: Land[],
    request: RequestItem
}

const act = () => {
    const modal = document.getElementById('modal_my_lands') as HTMLDialogElement | null;

    if (modal) {
        modal.showModal();
    } else {
        console.error("Modal element not found");
    }
}

const ExchangeDetails = ({ lands, request }: ExchangeDetailsProps) => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const requestOwners: string[] = [];
    requestOwners[0] = request.owner1 === connectedAddress ? "Vous" : request.owner1;
    requestOwners[1] = request.owner2 === connectedAddress ? "Vous" : request.owner2;
    const payReceiverIndex = request.payerIndex === 2 ? 1 : 2;
    const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
    let formattedBalances = []
    const formattedBalance_0 = lands[0].price ? Number(formatEther(BigInt(lands[0].price))) : 0;
    const formattedBalance_1 = lands[1].price ? Number(formatEther(BigInt(lands[1].price))) : 0;
    formattedBalances.push(formattedBalance_0, formattedBalance_1);
    return (
        <>
            <div className="bg-neutral text-neutral-content p-8 mt-20 rounded-lg">
                {/* Flex container to hold multiple lands */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {lands.map((land, index) => (
                        <div key={index} className="flex flex-col lg:flex-row bg-neutral text-neutral-content w-full lg:w-1/2 space-y-4 p-4 shadow-lg rounded-lg">
                            {/* Left Section */}
                            <div className="w-full space-y-4">
                                {/* Title */}
                                <h1 className="text-4xl font-bold">{land.nom}</h1>

                                {/* Tag */}
                                <div className="badge badge-primary text-white p-3">{land.num} LAND</div>

                                {/* Description */}
                                <div className="mt-4">
                                    <h2 className="text-lg font-semibold">Description</h2>
                                    <p className="text-sm">No description</p>
                                </div>

                            </div>

                            {/* Right Section */}
                            <div className="w-full bg-base-100 text-base-content shadow-lg p-6 rounded-lg">
                                {/* Price */}
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl font-bold">{formatEther(BigInt(land.price))} ETH</span>
                                    <span className="text-sm text-gray-500">{(nativeCurrencyPrice * formattedBalances[index]).toFixed(2)} $</span>
                                </div>

                                {/* Item Details */}
                                <div className="mt-6 space-y-2">
                                    {/* <div className="flex justify-between">
                                    <span className="font-semibold">Type</span>
                                    <span>{land.type}</span>
                                </div> */}
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Network</span>
                                        <span>ETHEREUM</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="font-semibold">Propriétaire</span>
                                        <div className="flex items-center space-x-2">
                                            {/* Owner Avatar */}
                                            <p className="font-semibold text-sm"><Address address={requestOwners[index]} /> </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
            <div className="flex justify-start mt-6">
                <div className="w-full max-w-lg bg-base-100 text-base-content shadow-lg p-6 rounded-lg border border-gray-200">
                    <div className="space-y-4">
                        {/* Price Difference Section */}
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="font-semibold text-gray-600">Différence de prix</span>
                            <span className="text-lg font-bold text-indigo-600">{formatEther(BigInt(request.priceDifference))} ETH</span>
                        </div>

                        {/* Payment Details Section */}
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">
                                {requestOwners[request.payerIndex - 1]} {requestOwners[request.payerIndex - 1] === "Vous" ? "allez" : "va"} payer {formatEther(BigInt(request.priceDifference))} ETH à:
                            </span>
                            <span className="mt-2 flex items-center space-x-2 text-lg font-semibold text-indigo-600">
                                <Address address={requestOwners[payReceiverIndex - 1]} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ExchangeDetails;