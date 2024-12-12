'use client'
import classes from './pick.module.css'
import AvatarContext from "@/components/avatar/avatar-context";
import {useContext, useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Loading from "@/components/loading/loading";
import {getFromIndexedDB} from "@/components/drawer/drawer";

export default function PickPage() {
    const {setAvatar, setSavedFile, setBackground} = useContext(AvatarContext);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); // For initial fake loading
    const [isAvatarLoading, setIsAvatarLoading] = useState(false); // For fake loading after avatar selection

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 200);
    }, []);

    const handleAvatarSelect = (avatar: string) => {
        setIsAvatarLoading(true);
        setTimeout(() => {
            setAvatar(avatar);
            setIsAvatarLoading(false);
            router.push('/pages/main');
        }, 500);
    };

    useEffect(() => {
        const loadSavedImage = async () => {
            const savedImage = await getFromIndexedDB("backgroundImage");
            if (savedImage) {
                setBackground(savedImage); // Tetapkan sebagai background
                setSavedFile(savedImage); // Simpan URL/Base64 ke state
            }
        };

        loadSavedImage();
    }, []);

    return (
        <div className={classes.body}>
            {(isLoading || isAvatarLoading) && <Loading/>}
            <div className={classes.item} onClick={() => handleAvatarSelect('male')}>
                <img src="/male-profile.svg" alt="Male Profile"/>
                <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl ${classes.h1}`}>
                    Male
                </h1>
            </div>
            <div className={classes.item} onClick={() => handleAvatarSelect('female')}>
                <img src="/female-profile.svg" alt="Female Profile"/>
                <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl ${classes.h1}`}>
                    Female
                </h1>
            </div>
        </div>
    )
}