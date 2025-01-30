import { Land } from "~~/types/land";
import LandCard from "./LandCard";
import Link from "next/link";

interface RequestComponentProps {
    land1: Land,
    land2: Land,
    id: bigint,
    type: string

}

const RequestComponent = ({ land1, land2, id, type }: RequestComponentProps) => {
    return (
        <div className="container mx-auto p-10 bg-white max-w-4xl">
            <div className="flex justify-center mb-5">
                Demande d'échange : {land1.nom} | {land2.nom}
            </div>
            <div className="flex justify-between">
                <LandCard land={land1} />
                <LandCard land={land2} />
            </div>
            <div className="action flex justify-center mt-14">
                <Link href={type === "notary" ? `/notary/approvals/${id}` : `/myRequests/${id}`} className="btn btn-neutral btn-wide">Voir les détails</Link>
            </div>
        </div>);
}

export default RequestComponent;