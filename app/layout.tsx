'use client';

import "./globals.css";
import {Inter} from 'next/font/google';
import AvatarContext, {AvatarProvider} from "@/components/avatar/avatar-context";
import {ThemeProvider} from "next-themes";
import {useContext, useEffect} from "react";

const inter = Inter({subsets: ['latin']});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
            <AvatarProvider>
                <ChildComponent>{children}</ChildComponent>
            </AvatarProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}

function ChildComponent({children}: { children: React.ReactNode }) {
    const {background} = useContext(AvatarContext);

    useEffect(() => {
        console.log("background", background);
    }, [background]);

    return (
        <div
            style={{
                backgroundImage: background ? `url(/bg/${background})` : 'url("/bg/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {children}
        </div>
    );
}
