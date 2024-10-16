import { useState } from "react";

const Filter = () => {
    const [status, setStatus] = useState<string>("all");
    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value);
    };
    return (
        <div className="p-4 max-w-xs rounded-md shadow-lg mb-5">
            <div className="mb-4">
                <h2 className="font-bold mb-2">Status</h2>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">All lands</span>
                        <input
                            type="radio"
                            name="status"
                            className="radio checked:bg-primary"
                            value="all"
                            checked={status === "all"}
                            onChange={handleStatusChange}
                        />
                    </label>
                    <label className="label cursor-pointer">
                        <span className="label-text">Available to buy</span>
                        <input
                            type="radio"
                            name="status"
                            className="radio checked:bg-primary"
                            value="buy"
                            checked={status === "buy"}
                            onChange={handleStatusChange}
                        />
                    </label>
                    <label className="label cursor-pointer">
                        <span className="label-text">Owned by me</span>
                        <input
                            type="radio"
                            name="status"
                            className="radio checked:bg-primary"
                            value="mine"
                            checked={status === "mine"}
                            onChange={handleStatusChange}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}

export default Filter;