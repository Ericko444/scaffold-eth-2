"use client";

import { formatEther } from "viem";
import { ModalMyLands } from "~~/app/marketplace/_components/ModalMyLands";
import { AuctionItem, Land } from "~~/types/land";
import { Address } from "../scaffold-eth";
import DurationInput from "../utils/DurationInput";
import { useState } from "react";
import { Duration } from "~~/types/utils";
import { redirect } from "next/navigation";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useAppDispatch, useAppSelector } from "~~/lib/hooks";
import { selectAuctionById, updateAuction } from "~~/lib/features/land/auctionSlice";
import { useGlobalState } from "~~/services/store/store";
import BidInput from "../utils/BidInput";

interface AuctionUserDetailsProps {
    land: Land,
    auction: AuctionItem
}

const act = () => {
    const modal = document.getElementById('modal_bid') as HTMLDialogElement | null;

    if (modal) {
        modal.showModal();
    } else {
        console.error("Modal element not found");
    }
}

const AuctionUserDetails = ({ land, auction }: AuctionUserDetailsProps) => {
    const dispatch = useAppDispatch();
    const auctionIt = useAppSelector((state) => selectAuctionById(state, auction.landId));
    const { writeContractAsync, isPending } = useScaffoldWriteContract("LandRegistry");
    const [bid, setBid] = useState<string>("0");
    const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
    const formattedBalance = land.price ? Number(formatEther(BigInt(land.price))) : 0;
    console.log("END TIME", auction.endTime);
    const handleBid = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "placeBid",
                    args: [BigInt(auctionIt.auction.landId)],
                    value: BigInt(bid)
                },
                {
                    onBlockConfirmation: txnReceipt => {
                        console.log("📦 Transaction blockHash", txnReceipt.blockHash);
                        dispatch(updateAuction({
                            id: auctionIt.auction.landId,
                            changes: {
                                isPending: false,
                                active: true
                            }
                        }));
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
                {auctionIt.auction.active && (<button className="btn btn-primary w-full text-white" onClick={act}>BID</button>)}
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
                <div className="flex justify-between">
                    <span className="font-semibold">Highest Bid</span>
                    <span>{formatEther(BigInt(auction.highestBid))} ETH</span>
                </div>
            </div>
        </div>
        <dialog id="modal_bid" className="modal modal-bottom sm:modal-middle text-black">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Set Bid</h3>
                <BidInput minimumBid={Number(formatEther(BigInt(land.price)))} onBidChange={setBid} />
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-success" onClick={handleBid}>Confirm</button>
                        <button className="btn btn-error ml-4">Cancel</button>
                    </form>
                </div>
            </div>
        </dialog>
    </div>);
}

export default AuctionUserDetails;