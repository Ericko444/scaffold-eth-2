"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import AuctionGovDetails from "~~/components/land-maps/AuctionGovDetails";
import AuctionUserDetails from "~~/components/land-maps/AuctionUserDetails";
import MapView from "~~/components/land-maps/MapView";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { selectAuctionById, selectAuctions } from "~~/lib/features/land/auctionSlice";
import { useAppSelector } from "~~/lib/hooks";
import { AuctionDTO, Land } from "~~/types/land";

export default function Page({ params }: { params: { slug: string } }) {
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const [isAdmin, setisAdmin] = useState<boolean>(false);
    const [lands, setLands] = useState<Land[]>([]);
    const auctions = useAppSelector(selectAuctions);

    const { data: getBids } = useScaffoldReadContract({
        contractName: "LandRegistry",
        functionName: "getBids",
        args: [BigInt(params.slug)],
        watch: true,
    });

    console.log("BIDS", getBids);

    function filterById(items: AuctionDTO[], id: number): AuctionDTO[] {
        return items.filter(item => item.id === id);
    }

    const auctionDt = filterById(auctions, Number(params.slug));
    console.log(auctionDt);

    useEffect(() => {
        if (auctionDt.length > 0 && !!auctionDt[0].land) {
            setLands(lands.concat([auctionDt[0].land]));
        }

        if (connectedAddress === "0x1a98EbD96CDB77A8Ea6cE8Bc3EcCd3B449712c7B") {
            setisAdmin(true);
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
            {!!lands && lands.length > 0 && isAdmin ? (
                <AuctionGovDetails land={lands[0]} auction={auctionDt[0].auction} />
            ) : (
                <p></p>
            )}
            {!!lands && lands.length > 0 && !isAdmin ? (
                <AuctionUserDetails land={lands[0]} auction={auctionDt[0].auction} />
            ) : (
                <p></p>
            )}
            <div className="flex justify-start px-4 md:px-0 mt-6">
                <div className="overflow-x-auto w-auto shadow-2xl rounded-xl bg-base-100 p-4">
                    <h4 className="text-lg font-bold text-black mb-4">Liste des enchères</h4>
                    <table className="table w-full text-base bg-neutral-focus text-primary rounded-lg table-zebra">
                        <thead>
                            <tr className="text-sm text-primary">
                                <th className="bg-primary text-primary-content rounded-tl-lg">Enchérisseur</th>
                                <th className="bg-primary text-primary-content rounded-tr-lg">Montant (ETH)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!!getBids && getBids[0].map((element, index) => (
                                <tr key={element} className="hover:bg-neutral-content hover:text-neutral-focus transition-all duration-200 ease-in-out text-sm">
                                    <td className="px-4 py-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="badge badge-accent badge-outline">#{index + 1}</div>
                                            <Address address={element} />
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 font-semibold text-accent-focus">
                                        {Number(formatEther(BigInt(getBids[1][index])))} ETH
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}