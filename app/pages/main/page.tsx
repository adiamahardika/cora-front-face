'use client'
import classes from './main.module.css'
import AvatarContext from "@/app/components/avatar/avatar-context";
import {useContext} from "react";
import IconSettings from "@/app/components/icon/icon";

export default function PickPage() {
    const {avatar} = useContext(AvatarContext);

    return (
        <div className={classes.body}>
            <div className={classes.wrapper}>
                <div className={classes.wrapperIcon}>
                    <IconSettings/>
                </div>
                <div className={classes.wrapperImg}>
                    <div>
                        alkdjalskdjalsdjalkjdaldsjlaskdjlaksdalskdj
                        <img className={classes.imgContainer} src="/container.svg" alt="Container Chat"/>
                    </div>
                    <img className={classes.imgProfile} src={`/${avatar}.svg`} alt="Selected Avatar"/>
                </div>
                <div className={classes.hidden}>
                    <IconSettings/>
                </div>
            </div>
        </div>
    )
}