import {useContext, useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import {
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer-settings';
import classes from './drawer.module.css';
import AvatarContext from '@/components/avatar/avatar-context';
import {Separator} from '@/components/ui/separator';
import {IconSquareRoundedPlus, IconTrash} from '@tabler/icons-react';
import FontSelector from '@/components/font-selector/font-selector';
import VolumeSliderComponent from '@/components/slider-volume/slider';
import ThemeSelector from '@/components/theme-selector/theme-selector';
import ToneSelector from '@/components/tone-selector/tone-selector';
import {Button} from '@/components/ui/button';
import {saveToIndexedDB, getAllFromIndexedDB, deleteFromIndexedDB} from '@/utils/database/indexed-settings-db';
import {Dialog, DialogContent, DialogFooter, DialogTitle} from '@/components/ui/dialog';
import {motion} from 'framer-motion';
import {imageVariants} from "@/components/image-sequence/image-sequence";
import Loading from "@/components/loading/loading";

export default function DrawerComponentSettings() {
    const {isCollapse, setIsCollapse, background, setBackground} = useContext(AvatarContext);
    const [error, setError] = useState<string | null>(null);
    const [savedFiles, setSavedFiles] = useState<string[]>([]);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSavedBackgrounds = async () => {
            const backgrounds = await getAllFromIndexedDB();
            setSavedFiles(backgrounds);
        };
        fetchSavedBackgrounds();
    }, []);

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: async (acceptedFiles, rejectedFiles) => {
            if (acceptedFiles.length > 0) {
                setError(null);
                const file = acceptedFiles[0];
                const reader = new FileReader();

                reader.onloadend = () => {
                    const fileUrl = reader.result as string;
                    setSavedFiles((prev) => [...prev, fileUrl]);
                    saveToIndexedDB(Date.now().toString(), file); // Unique ID
                };
                reader.readAsDataURL(file);
            }
            if (rejectedFiles.length > 0) {
                setError('Only image files are accepted.');
            }
        },
    });

    const toggleCollapse = () => {
        setIsCollapse(!isCollapse);
    };

    const handleSetBackground = (imageName: string) => {
        setBackground(imageName);
    };

    const handleDeleteImage = async () => {
        if (fileToDelete) {
            await deleteFromIndexedDB(fileToDelete);
            setSavedFiles((prev) => {
                const updatedFiles = prev.filter((file) => file !== fileToDelete);

                // Check if the deleted file is the current background
                if (fileToDelete === background) {
                    // Choose an alternative background
                    if (updatedFiles.length > 0) {
                        setBackground(updatedFiles[0]); // Use the first remaining saved file
                    } else if (backgroundImages.length > 0) {
                        setBackground(backgroundImages[0]); // Fallback to default images
                    } else {
                        setBackground(null); // Reset background if no alternatives exist
                    }
                }

                return updatedFiles;
            });
            setFileToDelete(null);
        }
    };

    useEffect(() => {
        const fetchSavedBackgrounds = async () => {
            setIsLoading(true); // Mulai loading
            const backgrounds = await getAllFromIndexedDB();
            setSavedFiles(backgrounds);

            // Atur background default jika belum ada
            if (!background && (backgrounds.length > 0 || backgroundImages.length > 0)) {
                setBackground(backgrounds[0] || backgroundImages[0]);
            }
            setIsLoading(false); // Selesai loading
        };
        fetchSavedBackgrounds();
    }, []);

    const backgroundImages = [
        '/bg/background1.png',
        '/bg/background2.png',
        '/bg/background3.png',
        '/bg/background4.png',
    ];

    return (
        <>
            <DrawerContent isCollapse={isCollapse}>
                {isLoading ? <Loading/> : <>
                    <DrawerHeader>
                        <DrawerTitle>Settings</DrawerTitle>
                    </DrawerHeader>
                    <div className={classes.container}>
                        <>
                            <div className={classes.wrapper}>
                                <div className={classes.item}>
                                    <p>Background</p>
                                    <img
                                        src={background}
                                        alt="background"
                                        className={`rounded-md object-cover ${classes.toggleImg}`}
                                        onClick={toggleCollapse}
                                        style={{cursor: 'pointer'}}
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
                                    <ToneSelector/>
                                </div>
                                <div className={classes.item}>
                                    <p>Tema</p>
                                    <ThemeSelector/>
                                </div>
                            </div>
                            {isCollapse && (
                                <>
                                    <Separator orientation={'vertical'}/>
                                    <div
                                        className={`${classes.background} overflow-y-auto`}
                                        style={{maxHeight: 'calc(100vh - 100px)'}}
                                    >
                                        <Button
                                            className={`${classes.upload} rounded-md`}
                                            {...getRootProps()}
                                        >
                                            <input {...getInputProps()} />
                                            <IconSquareRoundedPlus
                                                style={{fontSize: '32px', width: '32px', height: '32px'}}
                                            />
                                        </Button>

                                        {savedFiles.map((file, index) => (
                                            <motion.div
                                                key={index}
                                                custom={index}
                                                initial="hidden"
                                                animate="visible"
                                                variants={imageVariants}
                                                className={`${classes.imageWrapper} relative group`}
                                            >
                                                <img
                                                    src={file}
                                                    alt={`Uploaded background ${index + 1}`}
                                                    className={`${classes.img} group-hover:opacity-70`}
                                                />
                                                <div
                                                    className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100"
                                                    style={{background: 'rgba(0, 0, 0, 0.5)'}}
                                                    onClick={() => handleSetBackground(file)}
                                                >
                                                    <IconTrash
                                                        className="text-white cursor-pointer"
                                                        size={24}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFileToDelete(file);
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}

                                        {backgroundImages.map((image, index) => (
                                            <motion.div
                                                key={index}
                                                custom={index + savedFiles.length} // Pastikan urutan delay benar
                                                initial="hidden"
                                                animate="visible"
                                                variants={imageVariants}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Background ${index + 1}`}
                                                    className={classes.img}
                                                    onClick={() => handleSetBackground(image)}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    </div>
                    <Dialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
                        <DialogContent>
                            <DialogTitle>Hapus Gambar</DialogTitle>
                            <p>Apakah Anda yakin ingin menghapus gambar ini?</p>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setFileToDelete(null)}>
                                    Batal
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteImage}>
                                    Hapus
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>}
            </DrawerContent>
        </>
    );
}
