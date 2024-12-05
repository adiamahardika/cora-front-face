'use client'
import classes from './pick.module.css'
import AvatarContext from "@/components/avatar/avatar-context";
import {useContext, useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Loading from "@/components/loading/loading";

export default function PickPage() {
    const {setAvatar} = useContext(AvatarContext);
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

    return (
        <div className={classes.body}>
            {(isLoading || isAvatarLoading) && <Loading/>}
            <div className={classes.item} onClick={() => handleAvatarSelect('male')}>
                <img src="/male-profile.svg" alt="Male Profile"/>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">
                    Male
                </h1>
            </div>
            <div className={classes.item} onClick={() => handleAvatarSelect('female')}>
                <img src="/female-profile.svg" alt="Female Profile"/>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">
                    Female
                </h1>
            </div>
        </div>
    )
}