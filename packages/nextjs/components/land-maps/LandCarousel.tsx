import { Land } from "~~/types/land";
import LandCard from "./LandCard";

interface LandCarouselProps {
    lands: Land[]
}
const LandCarousel = ({ lands }: LandCarouselProps) => {
    return (<div className="flex flex-row">
        {lands.map(land => (
            <LandCard land={land} />
        ))}
    </div>);
}

export default LandCarousel;