import { Land } from "~~/app/myLands/_components/LandsTable";
import { useState } from "react";
import { ChangeEvent } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface ModalDivideProps {
    land: Land | null;
}

interface Geometry {
    type: string;
    coordinates: any;
}

interface Feature {
    geometry: Geometry;
}

interface FeatureCollection {
    type: string;
    features: Feature[];
}


export const ModalDivide = ({ land }: ModalDivideProps) => {
    const [jsonData, setJsonData] = useState<any>(null);
    const [geometryStrings, setGeometryStrings] = useState<string[]>([]);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                try {
                    const text = e.target?.result as string;
                    const jsonData: FeatureCollection = JSON.parse(text);

                    const geometryStrings: string[] = jsonData.features.map((feature: Feature) => {
                        return JSON.stringify(feature.geometry);
                    });

                    setGeometryStrings(geometryStrings);
                    console.log('Geometry Strings:', geometryStrings);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };

            reader.readAsText(file);
        }
    };

    const { writeContractAsync, isPending } = useScaffoldWriteContract("YourContract");

    const handleDivision = async () => {
        try {
            await writeContractAsync(
                {
                    functionName: "divideLandNFT",
                    args: [land?.id, geometryStrings, ["0x7622b05c1cD2fC41a1C65D2Cee5C6CECbe0d23A7", "0x93D8857DE05987a87549114594030F7812B7826f"]],
                },
                {
                    onBlockConfirmation: txnReceipt => {
                        console.log("📦 Transaction blockHash", txnReceipt.blockHash);
                    },
                },
            );
        } catch (e) {
            console.error("Error requesting exchange", e);
        }
    };


    return (
        <dialog id="modal_divide" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Divide land :</h3>
                <p>{land?.nom}</p>
                <div className="mt-5 mb-5">
                    <p>Split data input :</p>
                    <input
                        type="file"
                        accept=".geojson"
                        onChange={handleFileUpload}
                        className="file-input file-input-bordered file-input-primary w-full max-w-xs" />
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-primary" onClick={handleDivision}>Validate</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}