'use client'
import classes from './main.module.css'
import AvatarContext from "@/components/avatar/avatar-context";
import {useContext, useEffect, useState} from "react";
import IconSettings from "@/components/icon/icon";
import BubbleComponent from "@/components/bubble-container/bubble";
import WebSocketGreeting from '@/components/welcome/welcome';

export default function MainPage() {
    const {avatar} = useContext(AvatarContext);
    // State to store the greeting
    const [greeting, setGreeting] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (greeting) {
            setIsSpeaking(true);
            // const timer = setTimeout(() => setIsSpeaking(false), 3000);
            // return () => clearTimeout(timer);
        }
    }, [greeting]);

    return (
        <div className={classes.body}>
            <div className={classes.wrapper}>
                <div className={classes.wrapperIcon}>
                    <IconSettings/>
                </div>
                <div className={classes.wrapperImg}>
                    <BubbleComponent content={greeting} isVisible={isSpeaking}/>
                    <div className={classes.imgContainer}>
                        {isSpeaking ?
                            <img className={classes.imgProfile} src={`/${avatar}.gif`}/> :
                            <img
                                className={classes.imgProfile}
                                src={`/${avatar}.png`}
                            />
                        }
                    </div>
                </div>
                <div className={classes.hidden}>
                    <IconSettings/>
                </div>
                <WebSocketGreeting
                    aigender={avatar}
                    setGreetingCallback={setGreeting}
                    setTalking={setIsSpeaking}
                />
            </div>
        </div>
    );
}