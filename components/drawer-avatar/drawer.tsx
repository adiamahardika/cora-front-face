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
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";


export default function DrawerComponentAvatar() {
    const {setAvatar} = useContext(AvatarContext);
    const {theme} = useTheme(); // Get current theme

    const handleAvatarSelect = (avatar: string) => {
        setAvatar(avatar);
    };

    const cardBackgroundColor = theme === 'dark' ? 'var(--white)' : 'var(--black)';

    return (
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Select your avatar</DrawerTitle>
            </DrawerHeader>
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <Button
                        className={classes.cardAdd}
                        onClick={() => handleAvatarSelect('plus')}
                    >
                        <IconPlus style={{ fontSize: '32px', width: '32px', height: '32px' }} />
                    </Button>
                </div>
                <div className={classes.wrapper}>
                    <div
                        className={classes.card}
                        style={{ backgroundColor: cardBackgroundColor }}
                        onClick={() => handleAvatarSelect('male')}
                    >
                        <img className={classes.img} src="/male.svg" alt=""/>
                    </div>
                    <div
                        className={classes.card}
                        style={{ backgroundColor: cardBackgroundColor }}
                        onClick={() => handleAvatarSelect('female')}
                    >
                        <img className={classes.img} src="/female.svg" alt=""/>
                    </div>
                </div>
            </div>
        </DrawerContent>
    );
}
