"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AuctionGovDetails from "~~/components/land-maps/AuctionGovDetails";
import MapView from "~~/components/land-maps/MapView";
import { selectAuctionById, selectAuctions } from "~~/lib/features/land/auctionSlice";
import { useAppSelector } from "~~/lib/hooks";
import { AuctionDTO, Land } from "~~/types/land";

export default function Page({ params }: { params: { slug: string } }) {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const [lands, setLands] = useState<Land[]>([]);
    const auctions = useAppSelector(selectAuctions);

    function filterById(items: AuctionDTO[], id: number): AuctionDTO[] {
        return items.filter(item => item.id === id);
    }

    const auctionDt = filterById(auctions, Number(params.slug));
    console.log(auctionDt);

    useEffect(() => {
        if (auctionDt.length > 0 && !!auctionDt[0].land) {
            setLands(lands.concat([auctionDt[0].land]));
        }
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-start mb-4">
                <button className="btn" onClick={() => { }}>
                    Back
                </button>
            </div>
            <div className="flex items-center flex-col pt-10">
                <MapView lands={lands} />
            </div>
            {!!lands && lands.length > 0 ? (
                <AuctionGovDetails land={lands[0]} auction={auctionDt[0].auction} />
            ) : (
                <p>Loading data...</p>
            )}
            {/* <dialog id="modal_my_lands" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirmation exchange</h3>
                    <p className="py-4">{confMessage}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-success" onClick={handleAcceptExchange}>Accept offer</button>
                            <button className="btn btn-error ml-4">Deny</button>
                        </form>
                    </div>
                </div>
            </dialog> */}
            {/* <div className="flex items-center flex-col pt-10">
                <button className="btn btn-neutral btn-lg" onClick={act}>Accept offer</button>
            </div> */}
        </div>
    )
}