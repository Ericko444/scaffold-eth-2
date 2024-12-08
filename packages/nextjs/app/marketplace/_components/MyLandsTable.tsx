import { SetStateAction, useState } from 'react';
import { formatEther } from 'viem';

interface Land {
    id: bigint;
    num: string;
    nom: string;
    surface: string;
    surf_reel: string;
    price: bigint;
}


interface LandsTableProps {
    lands: readonly Land[]; // Expecting an array of Land[]
    setSelectedLandId: React.Dispatch<React.SetStateAction<number>>; // Type for setState function passed as a prop
    selectedLandId: number; // The currently selected land's ID
}


export const MyLandsTable = ({ lands, setSelectedLandId, selectedLandId }: LandsTableProps) => {
    // State to track the selected land

    // Function to handle radio button change
    const handleSelectLand = (id: number) => {
        setSelectedLandId(id);
    };

    return (
        <div className="flex justify-center px-4 md:px-0">
            <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
                <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
                    <thead>
                        <tr className="rounded-xl text-sm text-base-content">
                            <th className="bg-primary">Nom du titre</th>
                            <th className="bg-primary">Numero titre</th>
                            <th className="bg-primary">Prix</th>
                            <th className="bg-primary">Surface réelle</th>
                            <th className="bg-primary">Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lands.map((land) => (
                            <tr key={land.id} className="hover text-sm">
                                <td>{land.nom}</td>
                                <td>{land.num}</td>
                                <td>{Number(formatEther(BigInt(land.price))).toFixed(2)} ETH</td>
                                <td>{parseFloat(land.surf_reel.replace(",", ".")).toFixed(2)} Ha</td>
                                <td>
                                    <input
                                        type="radio"
                                        name="selectedLand"
                                        value={Number(land.id)}
                                        checked={selectedLandId === Number(land.id)}
                                        onChange={() => handleSelectLand(Number(land.id))}
                                        className="radio"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
