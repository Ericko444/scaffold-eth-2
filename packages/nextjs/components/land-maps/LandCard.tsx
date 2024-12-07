import { formatEther } from "viem";
import { Land } from "~~/types/land";

interface LandCardProps {
    land: Land
}

const LandCard = ({ land }: LandCardProps) => {
    return (<div className="card card-compact bg-base-100 w-72 shadow-xl ml-5 mr-5">
        <figure>
            <img
                src="/land.png"
                alt="Shoes" />
        </figure>
        <div className="card-body">
            <h2 className="card-title">{land.nom}</h2>
            <p>Superficie: {parseFloat(land.surf_reel.replace(",", ".")).toFixed(2)} Ha</p>
            <p>Prix: {Number(formatEther(BigInt(land.price))).toFixed(2)} ETH</p>
            <div className="card-actions justify-end">
                <button className="btn btn-primary">Détails</button>
            </div>
        </div>
    </div>);
}

export default LandCard;