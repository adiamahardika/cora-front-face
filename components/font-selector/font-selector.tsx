import {useContext, useEffect} from "react";
import AvatarContext from "@/components/avatar/avatar-context";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import {Inter, Poppins} from "next/font/google";

const inter = Inter({subsets: ['latin']});
const poppins = Poppins({subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']});

export default function FontSelector() {
    const {fontFamily, setFontFamily} = useContext(AvatarContext);

    const handleFontChange = (value: string) => {
        setFontFamily(value);
    };

    useEffect(() => {
        console.log("FontSelector -> fontFamily:", fontFamily);
    }, [fontFamily]);

    return (
        <Select value={fontFamily} onValueChange={handleFontChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Font"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Inter" className={inter.className}>Inter</SelectItem>
                <SelectItem value="Poppins" className={poppins.className}>Poppins</SelectItem>
            </SelectContent>
        </Select>
    );
}
