import { SetStateAction, useState } from 'react';

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
                            <th className="bg-primary">Numero</th>
                            <th className="bg-primary">Prix</th>
                            <th className="bg-primary">Surface réelle</th>
                            <th className="bg-primary">Surface</th>
                            <th className="bg-primary">Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lands.map((land) => (
                            <tr key={land.id} className="hover text-sm">
                                <td className="text-right md:py-4">{land.nom}</td>
                                <td className="text-right md:py-4">{land.num}</td>
                                <td className="text-right md:py-4">{Number(land.price)}</td>
                                <td className="text-right md:py-4">{land.surf_reel}</td>
                                <td className="text-right md:py-4">{land.surface}</td>
                                <td className="text-right md:py-4">
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
