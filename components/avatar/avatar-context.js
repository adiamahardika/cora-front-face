'use client';
import {createContext, useState, useEffect} from 'react';

const AvatarContext = createContext();

export const AvatarProvider = ({children}) => {
    const [avatar, setAvatar] = useState(() => localStorage.getItem('avatar') || null);
    const [background, setBackground] = useState(() => localStorage.getItem('background') || null);
    const [isCollapse, setIsCollapse] = useState(() => localStorage.getItem('isCollapse') === 'true');
    const [savedFile, setSavedFile] = useState(null);
    const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('fontFamily') || 'Inter');

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
            }}
        >
            {children}
        </AvatarContext.Provider>
    );
};

export default AvatarContext;
