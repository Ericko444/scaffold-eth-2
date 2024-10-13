import { Land } from "~~/types/land";
import LandCard from "./LandCard";
import Link from "next/link";

interface GridCardsProps {
    lands: Land[],
    type: string
}

const GridCards = ({ lands, type }: GridCardsProps) => {
    return (
        <div className="container mx-auto p-4">
            <div className="grid gap-6 gap-y-10 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {lands.map((item, index) => (
                    <Link href={`/${type}/${item.id}`}>
                        <LandCard
                            key={index}
                            land={item}
                        />
                    </Link>
                ))}
            </div>
        </div>);
}

export default GridCards;