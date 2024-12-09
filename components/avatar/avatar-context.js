'use client';
// context/AvatarContext.js
import { createContext, useState, useEffect } from 'react';

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
    const [avatar, setAvatar] = useState(null);
    const [background, setBackground] = useState(null);
    const [isCollapse, setIsCollapse] = useState(false);

    // Load avatar from localStorage on component mount
    useEffect(() => {
        const storedAvatar = localStorage.getItem('avatar');
        if (storedAvatar) {
            setAvatar(storedAvatar);
        }
    }, []);

    // Save avatar to localStorage whenever it changes
    useEffect(() => {
        if (avatar) {
            localStorage.setItem('avatar', avatar);
        }
    }, [avatar]);

    // Load background from localStorage on component mount
    useEffect(() => {
        const storedBackground = localStorage.getItem('background');
        if (storedBackground) {
            setBackground(storedBackground);
        }
    }, []);

    // Save background to localStorage whenever it changes
    useEffect(() => {
        if (background) {
            localStorage.setItem('background', background);
        }
    }, [background]);

    // Load isCollapse from localStorage on component mount
    useEffect(() => {
        const storedIsCollapse = localStorage.getItem('isCollapse');
        if (storedIsCollapse) {
            setIsCollapse(storedIsCollapse === 'true'); // Convert string to boolean
        }
    }, []);

    // Save isCollapse to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('isCollapse', isCollapse);
    }, [isCollapse]);

    return (
        <AvatarContext.Provider
            value={{
                avatar,
                setAvatar,
                background,
                setBackground,
                isCollapse,
                setIsCollapse
            }}
        >
            {children}
        </AvatarContext.Provider>
    );
};

export default AvatarContext;
