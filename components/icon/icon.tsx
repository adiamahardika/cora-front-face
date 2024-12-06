import {IconHexagon} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";

import classes from "./icon.module.css";
import {
    Drawer,
    DrawerTrigger
} from "@/components/ui/drawer";
import DrawerComponent from "@/components/drawer/drawer";

export default function IconSettings() {
    const [isHidden, setIsHidden] = useState(false);
    const timerRef = useRef<number | null>(null);

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
            <Drawer>
                <DrawerTrigger>
                    <div
                        className={`${classes.icon} ${isHidden ? classes.hidden : ""}`}
                    >
                        <IconHexagon size={32} stroke={3}/>
                    </div>
                </DrawerTrigger>
                <DrawerComponent/>
            </Drawer>
        </>
    );
}
