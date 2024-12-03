'use client'
import classes from './main.module.css'
import AvatarContext from "@/app/components/avatar/avatar-context";
import {useContext} from "react";

export default function PickPage() {
    const {avatar} = useContext(AvatarContext);
    return (
        <div className={classes.body}>
            <div>
                <img className={classes.img} src={`/${avatar}.svg`} alt="Selected Avatar"/>
            </div>
        </div>
    )
}