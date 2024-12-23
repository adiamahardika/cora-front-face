'use client';

import {
    DrawerContent,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer-avatar";

import classes from './drawer.module.css';
import AvatarContext from "@/components/avatar/avatar-context";
import {useContext} from "react";
import {IconPlus} from "@tabler/icons-react";


export default function DrawerComponentAvatar() {
    const {setAvatar} = useContext(AvatarContext);

    const handleAvatarSelect = (avatar: string) => {
        setAvatar(avatar);
    };

    return (
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Select your avatar</DrawerTitle>
            </DrawerHeader>
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <div className={classes.cardAdd} onClick={() => handleAvatarSelect('plus')}>
                        <IconPlus size={32}/>
                    </div>
                </div>
                <div className={classes.wrapper}>
                    <div className={classes.card} onClick={() => handleAvatarSelect('male')}>
                        <img className={classes.img} src="/male.svg" alt=""/>
                    </div>
                    <div className={classes.card} onClick={() => handleAvatarSelect('female')}>
                        <img className={classes.img} src="/female.svg" alt=""/>
                    </div>
                </div>
            </div>
        </DrawerContent>
    );
}
