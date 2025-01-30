import { formatEther } from "viem";
import { useGlobalState } from "~~/services/store/store";
import { Land } from "~~/types/land";
import { formatCurrency } from "~~/utils/balances/balances";

interface LandCardProps {
    land: Land
}

const LandCard = ({ land }: LandCardProps) => {
    const ariaryValue = useGlobalState(state => state.ariaryValue);
    const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
    const formattedBalance = land.price ? Number(formatEther(BigInt(land.price))) : 0;
    const ariaryBalance = (nativeCurrencyPrice * formattedBalance * ariaryValue);
    return (<div className="card card-compact bg-base-100 w-72 shadow-xl ml-5 mr-5">
        <figure>
            <img
                src="/land.png"
                alt="Shoes" />
        </figure>
        <div className="card-body">
            <h2 className="card-title">{land.nom}</h2>
            <p>Superficie: {parseFloat(land.surface.replace(",", ".")).toFixed(2)} Ha</p>
            <p>Prix: {Number(formatEther(BigInt(land.price))).toFixed(2)} ETH / {formatCurrency(ariaryBalance, "Ar")}</p>
            <div className="card-actions justify-end">
                <button className="btn btn-primary">Détails</button>
            </div>
        </div>
    </div>);
}

export default LandCard;