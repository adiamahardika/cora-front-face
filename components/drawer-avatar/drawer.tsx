'use client';

import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer-avatar';
import classes from './drawer.module.css';
import AvatarContext from '@/components/avatar/avatar-context';
import {IconPlus} from '@tabler/icons-react';
import {Button} from '@/components/ui/button';
import {useTheme} from 'next-themes';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {useToast} from "@/hooks/use-toast";

// IndexedDB setup
interface AvatarData {
    id: string;
    idleImage: string | null;
    talkingImage: string | null;
}

let db: IDBDatabase | null = null;

const openDatabase = (): Promise<IDBDatabase | null> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('AvatarDatabase', 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('avatars')) {
                db.createObjectStore('avatars', {keyPath: 'id'});
            }
        };

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('Database error:', (event.target as IDBOpenDBRequest).error);
            reject(new Error('Failed to open IndexedDB'));
        };
    });
};

const saveAvatar = async (avatarData: AvatarData): Promise<void> => {
    const db = await openDatabase();
    if (!db) return;

    const transaction = db.transaction('avatars', 'readwrite');
    const store = transaction.objectStore('avatars');
    const request = store.add(avatarData);

    request.onerror = (event) => {
        console.error('Error saving avatar:', (event.target as IDBRequest).error);
    };
};

const getAllAvatars = async (callback: (avatars: AvatarData[]) => void): Promise<void> => {
    const db = await openDatabase();
    if (!db) return;

    const transaction = db.transaction('avatars', 'readonly');
    const store = transaction.objectStore('avatars');
    const request = store.getAll();

    request.onsuccess = () => {
        callback(request.result as AvatarData[]);
    };

    request.onerror = (event) => {
        console.error('Error retrieving avatars:', (event.target as IDBRequest).error);
    };
};

const fetchAllAvatarsFromDB = async (): Promise<AvatarData[]> => {
    const db = await openDatabase();
    if (!db) return [];

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('avatars', 'readonly');
        const store = transaction.objectStore('avatars');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result as AvatarData[]);
        request.onerror = () => reject(new Error('Failed to fetch avatars'));
    });
};

const uploadImageBase64 = (file: File, callback: (base64Image: string) => void): void => {
    if (!file) {
        console.error('No file provided.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const base64Image = event.target?.result as string;
        callback(base64Image);
    };

    reader.onerror = (error) => {
        console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
};

export default function DrawerComponentAvatar(): JSX.Element {
    const {setAvatar} = useContext(AvatarContext);
    const {theme} = useTheme();
    const [open, setOpen] = useState(false);
    const [avatars, setAvatars] = useState<AvatarData[]>([]);
    const [idleImage, setIdleImage] = useState<string | null>(null);
    const [talkingImage, setTalkingImage] = useState<string | null>(null);
    const idleInputRef = useRef<HTMLInputElement | null>(null);
    const talkingInputRef = useRef<HTMLInputElement | null>(null);
    const {toast} = useToast()

    useEffect(() => {
        openDatabase();
        getAllAvatars(setAvatars);
    }, []);

    const handleFileUpload =
        (phase: "idle" | "talking") =>
            (event: React.ChangeEvent<HTMLInputElement>): void => {
                const file = event.target.files?.[0];
                if (file) {
                    if (file.type !== "image/png" && file.type !== "image/gif") {
                        toast({
                            title: "Invalid File Format",
                            description: "Please upload a file in PNG or GIF format.",
                            variant: "destructive",
                        });
                        return;
                    }

                    uploadImageBase64(file, (base64Image) => {
                        if (phase === "idle") {
                            setIdleImage(base64Image);
                        } else if (phase === "talking") {
                            setTalkingImage(base64Image);
                        }
                    });
                }
            };

    const handleButtonClick = (phase: 'idle' | 'talking') => (): void => {
        if (phase === 'idle') {
            idleInputRef.current?.click();
        } else if (phase === 'talking') {
            talkingInputRef.current?.click();
        }
    };

    const handleSaveAvatar = (): void => {
        if (!idleImage || !talkingImage) return;
        const newAvatar: AvatarData = {
            id: Date.now().toString(),
            idleImage,
            talkingImage,
        };
        saveAvatar(newAvatar);
        setAvatars((prev) => [...prev, newAvatar]);
        setIdleImage(null);
        setTalkingImage(null);
        setOpen(false);
    };

    useEffect(() => {
        openDatabase()
            .then(() => getAllAvatars(setAvatars))
            .catch((error) => console.error('Error opening database:', error));
    }, []);

    const cardBackgroundColor = theme === 'dark' ? 'var(--white)' : 'var(--black)';

    return (
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Select your avatar</DrawerTitle>
            </DrawerHeader>
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className={classes.cardAdd}
                                onClick={() => setOpen(true)}
                            >
                                <IconPlus style={{fontSize: '32px', width: '32px', height: '32px'}}/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Upload Avatar</DialogTitle>
                                <DialogDescription>
                                    Upload your avatar images for Idle and Talking phases.
                                </DialogDescription>
                            </DialogHeader>
                            <div className={classes.wrapperButton}>
                                <Button
                                    className={classes.button}
                                    style={{
                                        backgroundImage: idleImage ? `url(${idleImage})` : undefined,
                                        backgroundSize: 'cover',
                                        opacity: idleImage ? 0.4 : 1,
                                    }}
                                    onClick={handleButtonClick('idle')}
                                >
                                    <div className={classes.itemButton}>
                                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                            Idle Phase
                                        </h4>
                                        <p>.PNG or .GIF</p>
                                    </div>
                                </Button>
                                <input
                                    type="file"
                                    accept=".png,.gif"
                                    style={{display: 'none'}}
                                    ref={idleInputRef}
                                    onChange={handleFileUpload('idle')}
                                />
                                <Button
                                    className={classes.button}
                                    style={{
                                        backgroundImage: talkingImage ? `url(${talkingImage})` : undefined,
                                        backgroundSize: 'cover',
                                        opacity: talkingImage ? 0.4 : 1,
                                    }}
                                    onClick={handleButtonClick('talking')}
                                >
                                    <div className={classes.itemButton}>
                                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                            Talking Phase
                                        </h4>
                                        <p>.PNG or .GIF</p>
                                    </div>
                                </Button>
                                <input
                                    type="file"
                                    accept=".png,.gif"
                                    style={{display: 'none'}}
                                    ref={talkingInputRef}
                                    onChange={handleFileUpload('talking')}
                                />
                            </div>
                            <Button onClick={handleSaveAvatar} className={classes.buttonSave}>Save Avatar</Button>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className={classes.wrapper}>
                    {/* Static cards */}
                    <div
                        className={classes.card}
                        style={{backgroundColor: cardBackgroundColor}}
                        onClick={() => setAvatar('male')}
                    >
                        <img className={classes.img} src="/male.svg" alt="Male Avatar"/>
                    </div>
                    <div
                        className={classes.card}
                        style={{backgroundColor: cardBackgroundColor}}
                        onClick={() => setAvatar('female')}
                    >
                        <img className={classes.img} src="/female.svg" alt="Female Avatar"/>
                    </div>

                    {avatars.map((avatar) => (
                        <div
                            key={avatar.id}
                            className={classes.card}
                            style={{backgroundColor: cardBackgroundColor}}
                            onClick={() => setAvatar(avatar.id)}
                        >
                            <img className={classes.img} src={avatar.idleImage || ''} alt="Avatar"/>
                        </div>
                    ))}
                </div>

            </div>
        </DrawerContent>
    );
}
