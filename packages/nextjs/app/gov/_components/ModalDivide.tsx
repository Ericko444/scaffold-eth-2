// import { Land } from "~~/app/myLands/_components/LandsTable";
// import { useState } from "react";
// import { ChangeEvent } from "react";
// import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// import * as turf from '@turf/turf';

// interface ModalDivideProps {
//     land: Land | null;
// }

// interface Geometry {
//     type: string;
//     coordinates: any;
// }

// interface Feature {
//     geometry: Geometry;
// }

// interface FeatureCollection {
//     type: string;
//     features: Feature[];
// }


// export const ModalDivide = ({ land }: ModalDivideProps) => {
//     const [jsonData, setJsonData] = useState<any>(null);
//     const [geometryStrings, setGeometryStrings] = useState<string[]>([]);
//     const [number, setNumber] = useState<number | undefined>();
//     const [textValues, setTextValues] = useState<string[]>([]);

//     const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const newValue = event.target.value;
//         const parsedValue = newValue === '' ? undefined : Number(newValue);
//         setNumber(parsedValue);
//         const newCount = parsedValue ?? 0;

//         setTextValues((prevValues) => {
//             const values = [...prevValues];
//             if (newCount > values.length) {
//                 // Add empty strings to match the new count
//                 return values.concat(Array(newCount - values.length).fill(''));
//             } else {
//                 // Truncate the array to match the new count
//                 return values.slice(0, newCount);
//             }
//         });
//     };

//     const handleTextChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
//         const newValue = event.target.value;
//         setTextValues((prevValues) => {
//             const newValues = [...prevValues];
//             newValues[index] = newValue;
//             return newValues;
//         });
//     };

//     const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             const reader = new FileReader();

//             reader.onload = (e: ProgressEvent<FileReader>) => {
//                 try {
//                     const text = e.target?.result as string;
//                     const jsonData: FeatureCollection = JSON.parse(text);

//                     const geometryStrings: string[] = jsonData.features.map((feature: Feature) => {
//                         return JSON.stringify(feature.geometry);
//                     });

//                     const areasInHectares = geometryStrings.map((geometryString) => {
//                         const geometry = JSON.parse(geometryString); // Parse the geometry string into a GeoJSON object
//                         console.log('Geometry String:', geometryString);
//                         const areaInSquareMeters = turf.area(geometry); // Calculate the area in square meters
//                         return areaInSquareMeters / 10000; // Convert to hectares
//                     });

//                     // Log or return the areas in hectares
//                     console.log("areasInHectares", areasInHectares);

//                     setGeometryStrings(geometryStrings);
//                 } catch (error) {
//                     console.error('Error parsing JSON:', error);
//                 }
//             };

//             reader.readAsText(file);
//         }
//     };

//     const { writeContractAsync, isPending } = useScaffoldWriteContract("LandRegistry");

//     const handleDivision = async () => {
//         try {
//             await writeContractAsync(
//                 {
//                     functionName: "divideLandNFT",
//                     args: [land?.id, geometryStrings, textValues],
//                     // args: [land?.id, geometryStrings, ["0x7622b05c1cD2fC41a1C65D2Cee5C6CECbe0d23A7", "0x6A647c3c0cC1C267e18A96b68A0D98c48F0Ab3e3"]],
//                 },
//                 {
//                     onBlockConfirmation: txnReceipt => {
//                         console.log("📦 Transaction blockHash", txnReceipt.blockHash);
//                     },
//                 },
//             );
//         } catch (e) {
//             console.error("Error requesting exchange", e);
//         }
//     };

//     console.log(isPending, "...");


//     return (
//         <dialog id="modal_divide" className="modal">
//             <div className="modal-box w-11/12 max-w-5xl">
//                 <h3 className="font-bold text-lg">Divide land :</h3>
//                 <p>{land?.nom}</p>
//                 <div className="mt-5 mb-5">
//                     <p>Split data input :</p>
//                     <input
//                         type="file"
//                         accept=".geojson"
//                         onChange={handleFileUpload}
//                         className="file-input file-input-bordered file-input-primary w-full max-w-xs" />
//                 </div>
//                 <div className="mt-5 mb-5">
//                     <p>Number of divisions :</p>
//                     <input
//                         type="number"
//                         placeholder="Number of divisions"
//                         value={number !== undefined ? number : ''}
//                         onChange={handleNumberChange}
//                         className="input input-bordered input-primary w-full max-w-xs" />
//                 </div>
//                 <div className="mt-5 mb-5">
//                     <p>Adresses :</p>
//                     {textValues.map((value, index) => (
//                         <input
//                             className="input input-bordered input-primary w-full max-w-xs mr-3"
//                             key={index}
//                             placeholder={`Adress ${index + 1}`}
//                             type="text"
//                             value={value}
//                             onChange={handleTextChange(index)}
//                         />
//                     ))}
//                 </div>
//                 <div className="modal-action">
//                     <form method="dialog">
//                         <button className="btn btn-primary" onClick={handleDivision}>Validate</button>
//                     </form>
//                     <form method="dialog" className="modal-backdrop">
//                         <button>close</button>
//                     </form>
//                 </div>
//             </div>
//         </dialog>
//     )
// }