'use client';

import { useContext } from 'react';
import AvatarContext from "@/components/avatar/avatar-context";
import { Slider } from "@/components/ui/slider";

export default function VolumeSliderComponent() {
    const { volume, setVolume } = useContext(AvatarContext);

    const handleVolumeChange = (value: number[]) => {
        setVolume(value[0]); // Update context and localStorage with the first value
    };

    return (
        <Slider
            min={0}
            max={100}
            step={1}
            value={[volume]} // Wrap volume in an array
            onValueChange={handleVolumeChange} // Use the correct event handler
        />
    );
}
