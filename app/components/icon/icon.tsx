import {IconCaretUpFilled, IconSettings2} from "@tabler/icons-react";
import {useState} from "react";

import classes from './icon.module.css'

export default function IconSettings() {
    const [showSettings, setShowSettings] = useState(false);
    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };
    return (
        <>
            <div className={classes.icon} onClick={toggleSettings}>
                <IconCaretUpFilled size={32}/>
            </div>
            <div className={`${classes.icon} ${showSettings ? classes.show : classes.hidden}`}>
                <IconSettings2 size={32}/>
            </div>
        </>
    )
}