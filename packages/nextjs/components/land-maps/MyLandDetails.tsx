import { Land } from "~~/types/land";
import { formatEther } from "viem";
import { ModalMyLands } from "~~/app/marketplace/_components/ModalMyLands";
import Link from "next/link";

interface MyLandDetailsProps {
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

const MyLandDetails = ({ land }: MyLandDetailsProps) => {
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
                    <p className="font-semibold">DCLHodler#f6b2</p>
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
        <ModalMyLands idLandToExchange={land.id} />
    </div>
    );
}

export default MyLandDetails;