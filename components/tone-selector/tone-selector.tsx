'use client';

import { useContext } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AvatarContext from "@/components/avatar/avatar-context";

export default function ToneSelector() {
    const { tone, setTone } = useContext( AvatarContext );

    const handleToneChange = (value: string) => {
        setTone(value);
    };

    return (
        <Select value={tone} onValueChange={handleToneChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="santai">Santai</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
            </SelectContent>
        </Select>
    );
}
