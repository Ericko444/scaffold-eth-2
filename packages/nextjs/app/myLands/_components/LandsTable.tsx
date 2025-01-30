
export interface Land {
    id: bigint;
    num: string;
    nom: string;
    surface: string;
    surf_reel: string;
    price: bigint;
}

export interface Action {
    label: string,
    action: (land: Land) => void;
}

interface LandsTableProps {
    lands: readonly Land[]; // Expecting an array of Land[]
    actions: Action[];
}

export default function LandsTable({ lands, actions }: LandsTableProps) {
    console.log(actions);
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
                            <th className="bg-primary">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lands.map(land => (
                            <tr key={land.id} className="hover text-sm">
                                <td className="text-right md:py-4">{land.nom}</td>
                                <td className="text-right md:py-4">{land.num}</td>
                                <td className="text-right md:py-4">{Number(land.price)}</td>
                                <td className="text-right md:py-4">{land.surface}</td>
                                <td className="text-right md:py-4">{land.surface}</td>
                                <td className="text-right md:py-4">
                                    {actions.map(action => (
                                        <button className="btn btn-primary mr-2" onClick={() => { action.action(land) }}>{action.label}</button>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
