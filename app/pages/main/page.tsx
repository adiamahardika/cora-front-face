'use client'
import classes from './main.module.css'
import AvatarContext from "@/components/avatar/avatar-context";
import {useContext} from "react";
import IconSettings from "@/components/icon/icon";
import BubbleComponent from "@/components/bubble-container/bubble";
// import WebSocketGreeting from '@/components/welcome/welcome';

export default function PickPage() {
    const {avatar} = useContext(AvatarContext);

    return (
        <div className={classes.body}>
            <div className={classes.wrapper}>
                <div className={classes.wrapperIcon}>
                    <IconSettings/>
                </div>
                <div className={classes.wrapperImg}>
                    <BubbleComponent content={'Pluh'}/>
                    <div className={classes.imgContainer}>
                        <img
                            src="/mouth.gif"
                            alt="Mouth Animation"
                            className={classes.gif}
                        />
                        <img
                            className={classes.imgProfile}
                            src={`/${avatar}.svg`}
                            alt="Selected Avatar"
                        />
                    </div>
                </div>
                <div className={classes.hidden}>
                    <IconSettings/>
                </div>
                <WebSocketGreeting aigender= {avatar}/>
            </div>
        </div>
    )
}