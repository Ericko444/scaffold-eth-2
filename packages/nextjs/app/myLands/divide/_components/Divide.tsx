import { FeatureCollection, Feature } from "geojson";
import { ChangeEvent, useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Land, PolygonGeometry } from "~~/types/land";
import { useRouter } from 'next/navigation';
import * as turf from '@turf/turf';

interface DivideProps {
    land: Land,
    setLands: React.Dispatch<React.SetStateAction<Land[]>>;
}

export const Divide = ({ land, setLands }: DivideProps) => {
    const [jsonData, setJsonData] = useState<any>(null);
    const [geometryStrings, setGeometryStrings] = useState<string[]>([]);
    const [surfacesStrings, setSurfacesStrings] = useState<string[]>([]);
    const [number, setNumber] = useState<number | undefined>();
    const [textValues, setTextValues] = useState<string[]>([]);
    const [confMessage, setConfMessage] = useState<string>("");
    const router = useRouter();

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const parsedValue = newValue === '' ? undefined : Number(newValue);
        setNumber(parsedValue);
        const newCount = parsedValue ?? 0;

        setTextValues((prevValues) => {
            const values = [...prevValues];
            if (newCount > values.length) {
                // Add empty strings to match the new count
                return values.concat(Array(newCount - values.length).fill(''));
            } else {
                // Truncate the array to match the new count
                return values.slice(0, newCount);
            }
        });
    };

    const act = () => {
        const modal = document.getElementById('modal_divide') as HTMLDialogElement | null;

        if (modal) {
            modal.showModal();
        } else {
            console.error("Modal element not found");
        }
    }

    const handleTextChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setTextValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = newValue;
            return newValues;
        });
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                try {
                    const text = e.target?.result as string;
                    const jsonData: FeatureCollection = JSON.parse(text);

                    let lands: Land[] = [];

                    const count = jsonData.features.length

                    setNumber(count);

                    const newCount = count ?? 0;

                    setTextValues((prevValues) => {
                        const values = [...prevValues];
                        if (newCount > values.length) {
                            // Add empty strings to match the new count
                            return values.concat(Array(newCount - values.length).fill(''));
                        } else {
                            // Truncate the array to match the new count
                            return values.slice(0, newCount);
                        }
                    });

                    jsonData.features.forEach((feature, index) => {
                        console.log(`Feature ${index}:`, feature.geometry.type);
                    });

                    const geometryStrings: string[] = jsonData.features.map((feature: Feature, index) => {
                        let landItem = { ...land, geometry: feature.geometry as PolygonGeometry, nom: `${land.nom}-${index + 1}` };
                        lands.push(landItem);
                        return JSON.stringify({ geometry: feature.geometry });
                    });

                    const areasInHectares: string[] = jsonData.features
                        .filter((feature) => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')
                        .map((feature) => {
                            const geometry = feature.geometry;
                            const areaInSquareMeters = turf.area(geometry);
                            return (areaInSquareMeters / 10000).toFixed(2);
                        });

                    // Log or return the areas in hectares
                    console.log("areasInHectares", areasInHectares);

                    setLands(lands);

                    setGeometryStrings(geometryStrings);
                    setSurfacesStrings(areasInHectares);
                    console.log('Geometry Strings:', geometryStrings);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };

            reader.readAsText(file);
        }
    };

    const { writeContractAsync, isPending } = useScaffoldWriteContract("LandRegistry");

    const handleDivision = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "divideLandNFT",
                    args: [BigInt(land?.id), geometryStrings, surfacesStrings, textValues],
                    // args: [land?.id, geometryStrings, ["0x7622b05c1cD2fC41a1C65D2Cee5C6CECbe0d23A7", "0x6A647c3c0cC1C267e18A96b68A0D98c48F0Ab3e3"]],
                },
                {
                    onBlockConfirmation: txnReceipt => {
                        console.log("📦 Transaction blockHash", txnReceipt.blockHash);
                        router.push('/myLands');
                    },
                },
            );
        } catch (e) {
            console.error("Error requesting exchange", e);
        }
    };

    console.log(isPending, "...");
    return (
        <div className="bg-neutral text-neutral-content p-8 mt-20 rounded-lg">
            <h3 className="font-bold text-lg">Diviser terrain : {land?.nom}</h3>
            <div className="mt-5 mb-5">
                <p>Données (.shp ou .geojson) :</p>
                <input
                    type="file"
                    accept=".geojson"
                    onChange={handleFileUpload}
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs text-black" />
            </div>
            <div className="mt-5 mb-5">
                <p>Nombre de divisions :</p>
                <input
                    type="number"
                    placeholder="Number of divisions"
                    value={number !== undefined ? number : ''}
                    onChange={handleNumberChange}
                    className="input input-bordered input-primary w-full max-w-xs text-black" />
            </div>
            <div className="mt-5 mb-5">
                <p>Adresses :</p>
                {textValues.map((value, index) => (
                    <input
                        className="input input-bordered input-primary w-full max-w-md mr-3 text-black"
                        key={index}
                        placeholder={`Adress ${index + 1}`}
                        type="text"
                        value={value}
                        onChange={handleTextChange(index)}
                    />
                ))}
            </div>
            <button className="btn btn-primary" onClick={act}>Valider</button>
            <dialog id="modal_divide" className="modal modal-bottom sm:modal-middle text-black">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirmer la division</h3>
                    <p className="py-4">Confirmer la division du terrain {land?.nom}?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-success" onClick={handleDivision}>Confirmer</button>
                            <button className="btn btn-error ml-4">Annuler</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}