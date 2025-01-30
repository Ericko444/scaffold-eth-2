import { Land } from "~~/types/land";
import { formatEther } from "viem";
import { RequestItem } from "~~/app/myRequests/_components/RequestsTable";
import { useAccount } from "wagmi";

interface ApprovalDetailsProps {
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

const ApprovalDetails = ({ lands, request }: ApprovalDetailsProps) => {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const requestOwners: string[] = [];
    requestOwners[0] = request.owner1;
    requestOwners[1] = request.owner2;
    const payReceiverIndex = request.payerIndex === 2 ? 1 : 2;
    return (
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

                            {/* Owner Info */}
                            <div className="flex items-center mt-4 space-x-2">
                                {/* Owner Avatar */}
                                <div className="avatar">
                                    <div className="w-12 rounded-full">
                                        <img src="https://via.placeholder.com/48" alt="Owner Avatar" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold">{land.num}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="w-full bg-base-100 text-base-content shadow-lg p-6 rounded-lg">
                            {/* Price */}
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-bold">{formatEther(BigInt(land.price))} ETH</span>
                                <span className="text-sm text-gray-500">($7,072.06)</span>
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
                                    <span className="font-semibold">Owner</span>
                                    <div className="flex items-center space-x-2">
                                        {/* Owner Avatar */}
                                        <div className="avatar">
                                            <div className="w-6 rounded-full">
                                                <img src="https://via.placeholder.com/48" alt="Owner Avatar" />
                                            </div>
                                        </div>
                                        <p className="font-semibold text-sm">{requestOwners[index]}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center">
                <div className="w-full bg-base-100 text-base-content shadow-lg p-6 rounded-lg">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-semibold">Price difference</span>
                            <span>{formatEther(BigInt(request.priceDifference))} ETH</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Payer</span>
                            <span>{request.payerIndex}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">{requestOwners[request.payerIndex - 1]} will pay {formatEther(BigInt(request.priceDifference))} ETH to </span>
                            <span>{requestOwners[payReceiverIndex - 1]}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApprovalDetails;