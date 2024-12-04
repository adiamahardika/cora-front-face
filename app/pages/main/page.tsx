'use client'
import classes from './main.module.css'
import AvatarContext from "@/app/components/avatar/avatar-context";
import {useContext, useEffect, useState} from "react";
import {IconCaretUpFilled, IconSettings2} from "@tabler/icons-react";

export default function PickPage() {
    const {avatar} = useContext(AvatarContext);
    const [showSettings, setShowSettings] = useState(false);
    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    useEffect(() => {
        console.log(showSettings);
    }, [showSettings])

    return (
        <div className={classes.body}>
            <div className={classes.wrapper}>
                <div className={classes.wrapperIcon}>
                    <div className={classes.icon} onClick={toggleSettings}>
                        <IconCaretUpFilled size={32}/>
                    </div>
                    <div className={`${classes.icon} ${showSettings ? classes.show : classes.hidden}`}>
                        <IconSettings2 size={32}/>
                    </div>
                </div>
                <div className={classes.wrapperImg}>
                    <div>
                        <img className={classes.imgContainer} src="/container.svg" alt="Container Chat"/>
                    </div>
                    <img className={classes.imgProfile} src={`/${avatar}.svg`} alt="Selected Avatar"/>
                </div>
                <div className={classes.wrapperIconGone}>
                    <div className={classes.icon}><IconCaretUpFilled size={32}/></div>
                    <div className={classes.icon}><IconSettings2 size={32}/></div>
                </div>

            </div>
        </div>
    )
}