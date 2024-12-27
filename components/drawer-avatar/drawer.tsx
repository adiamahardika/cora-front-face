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
import {Switch} from "@/components/ui/switch";
import {AvatarData, getAllAvatars, openDatabase, saveAvatar, uploadImageBase64} from "@/utils/database/indexed-db";
import {Badge} from "@/components/ui/badge";

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
            voice: isFemale ? "female" : "male", // Use local state for voice
        };
        saveAvatar(newAvatar);
        setAvatars((prev) => [...prev, newAvatar]);
        setIdleImage(null);
        setTalkingImage(null);
        setIsFemale(false); // Reset local gender state
        setOpen(false);
    };

    const handleGenderSwitch = (checked: boolean): void => {
        setIsFemale(checked); // Update local gender state
    };

    const handleSelectAvatar = (avatarId: string): void => {
        const selectedAvatar = avatars.find((avatar) => avatar.id === avatarId);

        if (selectedAvatar) {
            setAvatar(selectedAvatar.id);
            if (selectedAvatar.voice) {
                setVoice(selectedAvatar.voice); // Update voice in AvatarContext
            }
        }
    };

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
                <div className={classes.wrapper}>
                    <div
                        className={classes.card}
                        style={{backgroundColor: cardBackgroundColor}}
                        onClick={() => {
                            setAvatar('male');
                            setVoice('male');
                        }}
                    >
                        <img className={classes.img} src="/male.svg" alt="Male Avatar"/>
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
                    </div>
                    <div
                        className={classes.card}
                        style={{backgroundColor: cardBackgroundColor}}
                        onClick={() => {
                            setAvatar('female');
                            setVoice('female');
                        }}
                    >
                        <img className={classes.img} src="/female.svg" alt="Female Avatar"/>
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
                    </div>

                    {avatars.map((avatar) => (
                        <div
                            key={avatar.id}
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
                                {avatar?.voice?.charAt(0).toUpperCase() + avatar?.voice?.slice(1)}
                            </Badge>
                        </div>
                    ))}
                </div>
            </div>
        </DrawerContent>
    );
}
