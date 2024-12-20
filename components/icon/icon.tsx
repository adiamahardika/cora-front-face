import {IconHexagon, IconUsersPlus} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";

import classes from "./icon.module.css";
import {Drawer, DrawerTrigger} from "@/components/ui/drawer";
import DrawerComponentAvatar from "@/components/drawer-avatar/drawer";
import DrawerComponentSettings from "@/components/drawer-settings/drawer";

export default function IconSettings() {
    const [isHidden, setIsHidden] = useState(false);
    const [activeDrawer, setActiveDrawer] = useState<"settings" | "avatar" | null>(null);
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
            <Drawer open={activeDrawer !== null} onOpenChange={(open) => !open && setActiveDrawer(null)}>
                <DrawerTrigger asChild>
                    <div className={classes.wrapper}>
                        <div
                            className={`${classes.icon} ${isHidden ? classes.hidden : ""}`}
                            onClick={() => setActiveDrawer("settings")}
                        >
                            <IconHexagon size={32} stroke={3}/>
                        </div>
                        <div
                            className={`${classes.icon} ${isHidden ? classes.hidden : ""}`}
                            onClick={() => setActiveDrawer("avatar")}
                        >
                            <IconUsersPlus size={32} stroke={2}/>
                        </div>
                    </div>
                </DrawerTrigger>
                {activeDrawer === "settings" && <DrawerComponentSettings/>}
                {activeDrawer === "avatar" && <DrawerComponentAvatar/>}
            </Drawer>
        </>
    );
}
