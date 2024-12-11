'use client'
import {useState} from "react";

const GifControl = () => {
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div>
            <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
            <div
                style={{
                    width: "300px",
                    height: "300px",
                    position: "relative",
                }}
            >
                {isPlaying ? (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundImage: 'url("/mouth.gif")',
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                        }}
                    ></div>
                ) : (
                    <img
                        src="/mouth.png" // Use your static image here
                        alt="Static image"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default GifControl;
