import {DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Slider} from "@/components/ui/slider";
import {Button} from "@/components/ui/button";

import classes from './drawer.module.css'

export default function DrawerComponent() {
    return (
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Settings</DrawerTitle>
            </DrawerHeader>
            <div className={classes.wrapper}>
                <div className={classes.item}>
                    <p>Background</p>
                    <img src="/background.png" alt="" className={`rounded-md object-cover ${classes.img}`}/>
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
            </div>
            <DrawerFooter>
                <Button>Rafa Keren</Button>
            </DrawerFooter>
        </DrawerContent>
    )
}