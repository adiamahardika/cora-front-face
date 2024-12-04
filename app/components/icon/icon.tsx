import {IconCaretUpFilled, IconCaretDownFilled, IconSettings2} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";

import classes from "./icon.module.css";

export default function IconSettings() {
    const [showSettings, setShowSettings] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const timerRef = useRef<number | null>(null);

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    useEffect(() => {
        const handleMouseMove = () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
            setIsHidden(false);

            timerRef.current = window.setTimeout(() => {
                setIsHidden(true);
            }, 1000);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <>
            <div
                className={`${classes.icon} ${isHidden ? classes.hidden : ""} ${
                    showSettings ? classes.show : ""
                }`}
                onClick={toggleSettings}
            >
                {showSettings ? (
                    <IconCaretDownFilled size={32}/>
                ) : (
                    <IconCaretUpFilled size={32}/>
                )}
            </div>
            <div
                className={`${classes.icon} ${
                    showSettings ? classes.show : classes.hidden
                }`}
            >
                <IconSettings2 size={32}/>
            </div>
        </>
    );
}
