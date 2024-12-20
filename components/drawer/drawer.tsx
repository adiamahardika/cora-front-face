'use client';

import {useContext, useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
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
import FontSelector from "@/components/font-selector/font-selector";
import VolumeSliderComponent from "@/components/slider-volume/slider";

const dbName = "BackgroundDB";
const storeName = "BackgroundImages";

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event?.target?.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, {keyPath: "id"});
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

const saveToIndexedDB = async (key, file) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);

            store.put({id: key, data: reader.result});

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
};


export const getFromIndexedDB = async (key: any) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result?.data || null);
        request.onerror = () => reject(request.error);
    });
};

export default function DrawerComponent() {
    const {isCollapse, setIsCollapse, background, setBackground, savedFile, setSavedFile} = useContext(AvatarContext);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: async (acceptedFiles, rejectedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                setError(null);
                const reader = new FileReader();

                reader.onloadend = () => {
                    const fileUrl = reader.result;
                    setBackground(fileUrl);
                    setSelectedFile(fileUrl);
                    setSavedFile(fileUrl);
                    saveToIndexedDB("backgroundImage", file);
                };
                reader.readAsDataURL(file);
            }
            if (rejectedFiles.length > 0) {
                setError("Only image files are accepted.");
            }
        }


    });

    const toggleCollapse = () => {
        setIsCollapse(!isCollapse);
    };

    const handleSetBackground = (imageName: string) => {
        setBackground(imageName);
    };

    // Array of background images
    const backgroundImages = [
        "/bg/background1.png",
        "/bg/background2.png",
        "/bg/background3.png",
        "/bg/background4.png",
    ];

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
                            src={background}
                            alt="background"
                            className={`rounded - md object-cover ${classes.toggleImg}`}
                            onClick={toggleCollapse}
                            style={{cursor: "pointer"}}
                        />
                    </div>
                    <div className={classes.item}>
                        <p>Font</p>
                        <FontSelector/>
                    </div>
                    <div className={classes.item}>
                        <p>Volume</p>
                        <div className={classes.slider}>
                            <VolumeSliderComponent/>
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
                                <SelectValue placeholder="Dark"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Dark</SelectItem>
                                <SelectItem value="dark">Light</SelectItem>
                                <SelectItem value="system">System</SelectItem>
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
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} /> {/* Input file */}
                                <IconSquareRoundedPlus size={32}/>

                            </div>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                            {(savedFile || selectedFile) && (
                                <img
                                    src={savedFile || selectedFile}
                                    className={classes.img}
                                    onClick={() => handleSetBackground(savedFile || selectedFile)}
                                />
                            )}
                            {backgroundImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={`${image}`}
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
