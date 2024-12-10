'use client';

import {useContext, useEffect} from "react";

import {
    DrawerContent,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Slider} from "@/components/ui/slider";

import classes from './drawer.module.css';
import AvatarContext from "@/components/avatar/avatar-context";
import {Separator} from "@/components/ui/separator";
import {IconSquareRoundedPlus} from "@tabler/icons-react";

export default function DrawerComponent() {
    const {isCollapse, setIsCollapse, background, setBackground} = useContext(AvatarContext);

    const toggleCollapse = () => {
        setIsCollapse(!isCollapse);
    };

    const handleSetBackground = (imageName: string) => {
        setBackground(imageName);
    };

    // Array of background images
    const backgroundImages = [
        "background1.png",
        "background2.png",
        "background3.png",
        "background4.png",
    ];

    useEffect(() => {
        console.log(isCollapse);
    }, [isCollapse]);

    return (
        <DrawerContent isCollapse={isCollapse}>
            <DrawerHeader>
                <DrawerTitle>Settings</DrawerTitle>
            </DrawerHeader>
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <div className={classes.item}>
                        <p>Background</p>
                        <img
                            src={`/bg/background1.png`}
                            alt="background"
                            className={`rounded - md object-cover ${classes.toggleImg}`}
                            onClick={toggleCollapse}
                            style={{cursor: "pointer"}}
                        />
                    </div>
                    <div className={classes.item}>
                        <p>Font Family</p>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Inter"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Inter</SelectItem>
                                <SelectItem value="light">Poppins</SelectItem>
                                <SelectItem value="dark">+ Jakarta Sans</SelectItem>
                                <SelectItem value="system">Helvetica</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={classes.item}>
                        <p>Font Size</p>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Medium"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Medium</SelectItem>
                                <SelectItem value="light">Small</SelectItem>
                                <SelectItem value="dark">Big</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={classes.item}>
                        <p>Volume</p>
                        <div className={classes.slider}>
                            <Slider defaultValue={[50]} max={100} step={1}/>
                        </div>
                    </div>
                    <div className={classes.item}>
                        <p>Gaya Bahasa</p>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Santai"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Santai</SelectItem>
                                <SelectItem value="dark">Tegas</SelectItem>
                                <SelectItem value="system">Normal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={classes.item}>
                        <p>Tema</p>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Santai"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Santai</SelectItem>
                                <SelectItem value="dark">Tegas</SelectItem>
                                <SelectItem value="system">Normal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {isCollapse && (
                    <>
                        <Separator orientation={"vertical"}/>
                        <div
                            className={`${classes.background} overflow-y-auto`}
                            style={{maxHeight: "calc(100vh - 100px)"}}
                        >
                            <div
                                className={`${classes.upload} rounded-md`}
                                // onClick={() => <>}
                            >
                                <IconSquareRoundedPlus size={32}/>
                            </div>
                            {/*{background && (*/}
                            {/*    <img src={`/bg/${background}`} alt="Selected Background" className={classes.img}/>*/}
                            {/*)}*/}
                            {backgroundImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={`/bg/${image}`}
                                    alt={`Background ${index + 1}`}
                                    className={classes.img}
                                    onClick={() => handleSetBackground(image)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </DrawerContent>
    );
}
