'use client';

import "./globals.css";
import {Inter, Poppins} from 'next/font/google';
import AvatarContext, {AvatarProvider} from "@/components/avatar/avatar-context";
import {ThemeProvider} from "next-themes";
import {useContext, useEffect} from "react";

const inter = Inter({subsets: ['latin']});
const poppins = Poppins({subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
        <body>
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
    const {background, fontFamily} = useContext(AvatarContext);

    useEffect(() => {
        // Dynamically update the font class on the `html` or `body` tag
        const root = document.documentElement; // Select the `html` tag
        if (fontFamily === "Poppins") {
            root.classList.add(poppins.className);
            root.classList.remove(inter.className);
        } else {
            root.classList.add(inter.className);
            root.classList.remove(poppins.className);
        }
    }, [fontFamily]);

    return (
        <div
            style={{
                backgroundImage: background ? `url(${background})` : 'url("/bg/background1.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {children}
        </div>
    );
}
