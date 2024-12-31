'use client';
import {createContext, useState, useEffect} from 'react';

const AvatarContext = createContext();

export const AvatarProvider = ({children}) => {
    const [avatar, setAvatar] = useState(() => localStorage.getItem('avatar') || 'male');
    const [background, setBackground] = useState(() => localStorage.getItem('background') || '/bg/background1.png');
    const [isCollapse, setIsCollapse] = useState(() => localStorage.getItem('isCollapse') === 'true');
    const [savedFile, setSavedFile] = useState(null);
    const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('fontFamily') || 'Inter');
    const [volume, setVolume] = useState(() => localStorage.getItem('volume') || 80);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
    const [tone, setTone] = useState(() => localStorage.getItem('tone') || 'professional');
    const [voice, setVoice] = useState(() => localStorage.getItem('voice') || '');

    useEffect(() => {
        if (avatar) {
            localStorage.setItem('avatar', avatar);
        }
    }, [avatar]);

    useEffect(() => {
        if (background) {
            localStorage.setItem('background', background);
        }
    }, [background]);

    useEffect(() => {
        localStorage.setItem('isCollapse', isCollapse);
    }, [isCollapse]);

    useEffect(() => {
        localStorage.setItem('fontFamily', fontFamily || '');
    }, [fontFamily]);

    useEffect(() => {
        localStorage.setItem('volume', volume)
    }, [volume]);

    useEffect(() => {
        localStorage.setItem('theme', theme)
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('tone', tone)
    }, [tone]);

    useEffect(() => {
        localStorage.setItem('voice', voice)
    }, [voice])

    return (
        <AvatarContext.Provider
            value={{
                avatar,
                setAvatar,
                background,
                setBackground,
                isCollapse,
                setIsCollapse,
                savedFile,
                setSavedFile,
                fontFamily,
                setFontFamily,
                volume,
                setVolume,
                theme,
                setTheme,
                tone,
                setTone,
                voice,
                setVoice,
            }}
        >
            {children}
        </AvatarContext.Provider>
    );
};

export default AvatarContext;
