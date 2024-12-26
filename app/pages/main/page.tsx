'use client';
import classes from './main.module.css';
import AvatarContext from "@/components/avatar/avatar-context";
import { useContext, useEffect, useState } from "react";
import IconSettings from "@/components/icon/icon";
import BubbleComponent from "@/components/bubble-container/bubble";
import WebSocketGreeting from '@/components/welcome/welcome';

interface AvatarData {
    id: string;
    idleImage: string | null;
    talkingImage: string | null;
}

    

console.log('wee woo')

export default function MainPage() {
    const { avatar } = useContext(AvatarContext); // The avatar ID
    const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
    const [greeting, setGreeting] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (avatar) {
            fetchAvatarFromDB(avatar)
                .then((data) => {
                    if (data) {
                        setAvatarData(data);
                    } else {
                        // If not in IndexedDB, fallback to local public folder
                        setAvatarData({
                            id: avatar,
                            idleImage: `/${avatar}.png`, // Local idle image
                            talkingImage: `/${avatar}.gif`, // Local talking image
                        });
                    }
                })
                .catch((error) => console.error('Error fetching avatar:', error));
        }
    }, [avatar]);

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
                    <IconSettings />
                </div>
                <div className={classes.wrapperImg}>
                    <BubbleComponent content={greeting} isVisible={isSpeaking} />
                    <div className={classes.imgContainer}>
                        {avatarData ? (
                            isSpeaking ? (
                                <img
                                    className={classes.imgProfile}
                                    src={avatarData.talkingImage || ''}
                                    alt="Talking Avatar"
                                />
                            ) : (
                                <img
                                    className={classes.imgProfile}
                                    src={avatarData.idleImage || ''}
                                    alt="Idle Avatar"
                                />
                            )
                        ) : (
                            <p>Loading avatar...</p>
                        )}
                    </div>
                </div>
                <div className={classes.hidden}>
                    <IconSettings />
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
