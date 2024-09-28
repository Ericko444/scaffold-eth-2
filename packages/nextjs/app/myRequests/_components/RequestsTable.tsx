
export interface Request {
    id: bigint;
    landId1: bigint;
    landId2: bigint;
    owner1: string;
    owner2: string;
    payerIndex: number; // 1 for owner1, 2 for owner2
    priceDifference: bigint;
    isAcceptedBySecondOwner: boolean;
    isApprovedByNotary: boolean;
}

export interface Action {
    label: string,
    action: (request: Request) => void;
}

interface RequestsTableProps {
    requests: readonly Request[]; // Expecting an array of Request[]
    actions: Action[];
}

export default function RequestsTable({ requests, actions }: RequestsTableProps) {
    console.log(actions);
    return (
        <div className="flex justify-center px-4 md:px-0">
            <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
                <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
                    <thead>
                        <tr className="rounded-xl text-sm text-base-content">
                            <th className="bg-primary">Terrain 1</th>
                            <th className="bg-primary">Terrain 2</th>
                            <th className="bg-primary">Difference de prix</th>
                            <th className="bg-primary">Etat</th>
                            <th className="bg-primary">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(request => (
                            <tr key={`${request.payerIndex}-k`} className="hover text-sm">
                                <td className="text-right md:py-4">{Number(request.landId1)}</td>
                                <td className="text-right md:py-4">{Number(request.landId2)}</td>
                                <td className="text-right md:py-4">{Number(request.priceDifference)}</td>
                                <td className="text-right md:py-4">{Number(request.priceDifference)}</td>
                                <td className="text-right md:py-4">
                                    {actions.map(action => (
                                        <button className="btn btn-primary" onClick={() => { action.action(request) }}>{action.label}</button>
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
