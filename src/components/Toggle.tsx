import { useEffect, useState } from "react";

interface ToggleProps<T> {
    onToggle?: (state: T) => void;
    toggleStates: [T, T];
    testid: string;
    choice?: T;
}

// the first item toggleStates[0] is always the default state except if choice is passed
const Toggle = <T extends any>({ onToggle, toggleStates, testid, choice }: ToggleProps<T>) => {
    const [isToggled, setToggled] = useState(false);

    useEffect(() => {
        setToggled(choice === undefined || choice === toggleStates[0] ? false : true);
    }, [choice]);

    const handleToggleClick = () => {
        const newState = !isToggled;
        setToggled(newState);

        if (onToggle) {
            onToggle(newState ? toggleStates[1] : toggleStates[0]);
        }
    };

    return (
        <button data-testid={testid} className="toggle" onClick={handleToggleClick}>
            <span className={`button-section ${isToggled ? "" : "selected"}`}>{String(toggleStates[0])}</span>
            <span className="button-divider">|</span>
            <span className={`button-section ${isToggled ? "selected" : ""}`}>{String(toggleStates[1])}</span>
        </button>
    );
};

export default Toggle;
