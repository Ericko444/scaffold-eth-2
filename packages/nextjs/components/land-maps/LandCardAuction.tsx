import { formatEther } from "viem";
import { AuctionItem, Land } from "~~/types/land";

interface LandCardAuctionProps {
    land: Land,
    auction: AuctionItem
}

const LandCardAuction = ({ land, auction }: LandCardAuctionProps) => {
    return (
        <div className="card card-compact bg-base-100 w-72 shadow-xl ml-5 mr-5 relative">
            <figure>
                <img src="/land.png" alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{land.nom}</h2>
                <div>
                    {auction.isPending && (<span className="badge badge-warning">Pending</span>)}
                    {auction.active && (<span className="badge badge-success">Active</span>)}
                    {auction.ended && (<span className="badge badge-error">Ended</span>)}
                </div>
                <p>Superficie: {land.surf_reel}</p>
                <p>Prix: {formatEther(BigInt(land.price))} ETH</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Détails</button>
                </div>
            </div>
        </div>);
}

export default LandCardAuction;