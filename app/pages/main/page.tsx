'use client';
import classes from './main.module.css';
import AvatarContext from "@/components/avatar/avatar-context";
import {useContext, useEffect, useState} from "react";
import IconSettings from "@/components/icon/icon";
import BubbleComponent from "@/components/bubble-container/bubble";
import WebSocketGreeting from '@/components/welcome/welcome';
import { AvatarData } from "@/utils/database/indexed-avatar-db";

export default function MainPage() {
    const {avatar, voice} = useContext(AvatarContext); // The avatar ID
    const [isProcessing, setIsProcessing] = useState(false); // State to track if processing
    const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
    const [greeting, setGreeting] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);

    const fetchAvatarFromDB = async (id: string): Promise<AvatarData | null> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("AvatarDatabase", 1);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains("avatars")) {
                    db.createObjectStore("avatars", {keyPath: "id"});
                }
            };

            request.onsuccess = () => {
                const db = request.result;

                if (!db.objectStoreNames.contains("avatars")) {
                    console.warn("Object store 'avatars' does not exist.");
                    resolve(null);
                    return;
                }

                const transaction = db.transaction("avatars", "readonly");
                const store = transaction.objectStore("avatars");
                const getRequest = store.get(id);

                getRequest.onsuccess = () => {
                    resolve((getRequest.result as AvatarData) || null);
                };

                getRequest.onerror = () => {
                    console.error("Error fetching data from object store.");
                    reject(new Error("Failed to fetch avatar data"));
                };
            };

            request.onerror = (event) => {
                console.error("Error opening IndexedDB:", event);
                reject(new Error("Failed to open IndexedDB"));
            };
        });
    };

    useEffect(() => {
        if (avatar) {
            fetchAvatarFromDB(avatar)
                .then((data) => {
                    if (data) {
                        setAvatarData(data);
                    } else {
                        setAvatarData({
                            id: avatar,
                            idleImage: `/${avatar}.png`,
                            talkingImage: `/${avatar}.gif`,
                            voice: voice
                        });
                    }
                })
                .catch((error) => console.error("Error fetching avatar:", error));
        }
    }, [avatar]);

    useEffect(() => {
        if (greeting) {
            setIsSpeaking(true);
            // const timer = setTimeout(() => setIsSpeaking(false), 3000);
            // return () => clearTimeout(timer);
        }
    }, [greeting]);

    useEffect(() => {
        console.log()
    }, []);

    return (
        <div className={classes.wrapper}>
            <div className={classes.containerIcon}>
                <IconSettings/>
            </div>
            <div className={classes.containerPerson}>
                <BubbleComponent content={greeting} isVisible={isSpeaking}/>
                <div className={classes.imgContainer}>
                    {avatarData ? (
                        isProcessing ? (
                            <img
                                className={classes.imgProfile}
                                src={avatarData.talkingImage || ""}
                                alt="Talking Avatar"
                            />
                        ) : (
                            <img
                                className={classes.imgProfile}
                                src={avatarData.idleImage || ""}
                                alt="Idle Avatar"
                            />
                        )
                    ) : (
                        <p>Loading avatar...</p>
                    )}
                </div>
            </div>
            <div className={'w-[50px]'}>
            </div>
            <WebSocketGreeting
                setGreetingCallback={setGreeting}
                setTalking={setIsSpeaking}
                setProcessing={setIsProcessing}
            />
        </div>
    );
}
