import React, { useState, ChangeEvent } from 'react';
import { Duration } from '~~/types/utils';

interface DurationInputProps {
    onChange?: (totalSeconds: number) => void;
}

const DurationInput: React.FC<DurationInputProps> = ({ onChange }) => {
    const [duration, setDuration] = useState<{ hours: number; minutes: number; seconds: number }>({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let intValue = parseInt(value, 10);

        if (isNaN(intValue) || intValue < 0) intValue = 0;
        if ((name === 'minutes' || name === 'seconds') && intValue > 59) intValue = 59;

        const newDuration = { ...duration, [name]: intValue };
        setDuration(newDuration);

        const totalSeconds = newDuration.hours * 3600 + newDuration.minutes * 60 + newDuration.seconds;

        if (onChange) {
            onChange(totalSeconds);
        }
    };

    return (
        <div className="flex space-x-4 items-end">
            {/* Hours Input */}
            <div className="form-control w-24">
                <label className="label">
                    <span className="label-text">Heures</span>
                </label>
                <input
                    type="number"
                    name="hours"
                    min="0"
                    value={duration.hours}
                    onChange={handleChange}
                    className="input input-bordered"
                />
            </div>

            {/* Minutes Input */}
            <div className="form-control w-24">
                <label className="label">
                    <span className="label-text">Minutes</span>
                </label>
                <input
                    type="number"
                    name="minutes"
                    min="0"
                    max="59"
                    value={duration.minutes}
                    onChange={handleChange}
                    className="input input-bordered"
                />
            </div>

            {/* Seconds Input */}
            <div className="form-control w-24">
                <label className="label">
                    <span className="label-text">Secondes</span>
                </label>
                <input
                    type="number"
                    name="seconds"
                    min="0"
                    max="59"
                    value={duration.seconds}
                    onChange={handleChange}
                    className="input input-bordered"
                />
            </div>
        </div>
    );
};

export default DurationInput;