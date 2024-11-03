import React, { useState, ChangeEvent } from 'react';
import { parseEther } from 'viem';

interface BidInputProps {
    minimumBid: number; // Minimum bid in ETH
    onBidChange?: (bidAmountWei: string) => void; // Bid amount in Wei
}

const BidInput: React.FC<BidInputProps> = ({ minimumBid, onBidChange }) => {
    const [bidAmountEth, setBidAmountEth] = useState<number>(minimumBid);
    const [error, setError] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = parseFloat(e.target.value);

        if (isNaN(value)) {
            value = minimumBid;
        }

        if (value < minimumBid) {
            setError(`Bid must be at least ${minimumBid} ETH`);
        } else {
            setError('');
        }

        setBidAmountEth(value);

        if (onBidChange && value >= minimumBid && !error) {
            // Convert ETH to Wei
            const bidAmountWei = parseEther(value.toString()).toString();
            onBidChange(bidAmountWei);
        }
    };

    return (
        <div className="form-control w-full max-w-xs">
            <label className="label">
                <span className="label-text">Your Bid (Minimum: {minimumBid} ETH)</span>
            </label>
            <input
                type="number"
                min={minimumBid}
                step="any"
                value={bidAmountEth}
                onChange={handleChange}
                className={`input input-bordered w-full max-w-xs ${error ? 'input-error' : ''}`}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};

export default BidInput;
