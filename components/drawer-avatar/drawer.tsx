import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle, DrawerTrigger,
} from '@/components/ui/drawer-avatar';
import classes from './drawer.module.css';
import AvatarContext from '@/components/avatar/avatar-context';
import {IconPlus, IconUsersPlus} from '@tabler/icons-react';
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
import {Switch} from "@/components/ui/switch";
import {
    AvatarData,
    getAllAvatars,
    openDatabase,
    saveAvatar,
    uploadImageBase64
} from "@/utils/database/indexed-avatar-db";
import {Badge} from "@/components/ui/badge";
import Loading from "@/components/loading/loading";
import {imageVariants} from "@/components/image-sequence/image-sequence";
import {motion} from "framer-motion";

export default function DrawerComponentAvatar(): JSX.Element {
    const {setAvatar, setVoice} = useContext(AvatarContext);
    const {theme} = useTheme();
    const [open, setOpen] = useState(false);
    const [avatars, setAvatars] = useState<AvatarData[]>([]);
    const [idleImage, setIdleImage] = useState<string | null>(null);
    const [talkingImage, setTalkingImage] = useState<string | null>(null);
    const [isFemale, setIsFemale] = useState(false); // Local gender state
    const idleInputRef = useRef<HTMLInputElement | null>(null);
    const talkingInputRef = useRef<HTMLInputElement | null>(null);
    const {toast} = useToast();
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        openDatabase();
        getAllAvatars((fetchedAvatars) => {
            setAvatars(fetchedAvatars);
            setIsFetching(false);
        });
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
            voice: isFemale ? "female" : "male",
        };
        saveAvatar(newAvatar);
        setAvatars((prev) => [...prev, newAvatar]);
        setIdleImage(null);
        setTalkingImage(null);
        setIsFemale(false);
        setOpen(false);
    };

    const handleGenderSwitch = (checked: boolean): void => {
        setIsFemale(checked);
    };

    const handleSelectAvatar = (avatarId: string): void => {
        const selectedAvatar = avatars.find((avatar) => avatar.id === avatarId);

        if (selectedAvatar) {
            setAvatar(selectedAvatar.id);
            if (selectedAvatar.voice) {
                setVoice(selectedAvatar.voice);
            }
        }
    };

    const cardBackgroundColor = theme === 'dark' ? 'var(--white)' : 'var(--black)';
    const textColor = theme === 'light' ? 'var(--white)' : 'var(--black)';

    return (
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Select your avatar</DrawerTitle>
            </DrawerHeader>
            {isFetching ? <Loading/> :
                (
                    <div className={classes.container}>
                        <div className={classes.wrapper}>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <motion.div
                                        variants={imageVariants}
                                        className={classes.cardAdd}
                                        style={{
                                            position: 'relative',
                                            backgroundColor: cardBackgroundColor,
                                            color: textColor
                                        }}
                                        onClick={() => setOpen(true)}
                                    >
                                        <IconPlus style={{fontSize: '32px', width: '32px', height: '32px'}}/>
                                    </motion.div>
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
                                    <div className={classes.genderSwitch}>
                                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight w-[100px] pl-2">
                                            Male
                                        </h4>
                                        <Switch
                                            checked={isFemale} // Local gender state
                                            onCheckedChange={handleGenderSwitch}
                                        />
                                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight w-[100px] text-right">
                                            Female
                                        </h4>
                                    </div>
                                    <Button onClick={handleSaveAvatar} className={classes.buttonSave}>
                                        <h4
                                            className="scroll-m-20 text-md font-semibold tracking-tight w-[100px]">
                                            Save Avatar
                                        </h4>
                                    </Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <motion.div initial="hidden" animate="visible" className={classes.wrapper}>
                            <motion.div
                                variants={imageVariants}
                                className={classes.card}
                                style={{position: 'relative', backgroundColor: cardBackgroundColor}}
                                onClick={() => {
                                    setAvatar('male');
                                    setVoice('male');
                                }}
                            >
                                <img className={classes.img} src={'/male.png'} alt="male"/>
                                <Badge
                                    className={classes.badge}
                                    style={{
                                        backgroundColor: '#60a5fa',
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                    }}
                                >
                                    Male
                                </Badge>
                            </motion.div>
                            <motion.div
                                variants={imageVariants}
                                className={classes.card}
                                style={{position: 'relative', backgroundColor: cardBackgroundColor}}
                                onClick={() => {
                                    setAvatar('female');
                                    setVoice('female');
                                }}
                            >
                                <img className={classes.img} src={'/female.png'} alt="female"/>
                                <Badge
                                    className={classes.badge}
                                    style={{
                                        backgroundColor: '#f87171',
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                    }}
                                >
                                    Female
                                </Badge>
                            </motion.div>
                        </motion.div>
                        <motion.div initial="hidden" animate="visible" className={classes.wrapper}>
                            {avatars.map((avatar, index) => (
                                <motion.div
                                    key={avatar.id}
                                    custom={index}
                                    variants={imageVariants}
                                    className={classes.card}
                                    style={{position: 'relative', backgroundColor: cardBackgroundColor}}
                                    onClick={() => handleSelectAvatar(avatar.id)}
                                >
                                    <img className={classes.img} src={avatar.idleImage || ''} alt="Avatar"/>
                                    <Badge
                                        className={classes.badge}
                                        style={{
                                            backgroundColor: avatar?.voice === 'female' ? '#f87171' : '#60a5fa',
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                        }}
                                    >
                                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                        {/*@ts-expect-error*/}
                                        {avatar?.voice?.charAt(0)?.toUpperCase() + avatar?.voice?.slice(1) || ''}
                                    </Badge>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )
            }
        </DrawerContent>
    )
}