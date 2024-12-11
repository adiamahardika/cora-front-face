"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";


const WebSocketGreeting = ({ aigender }: { aigender: string }) => {
  const [message, setMessage] = useState("Waiting for greeting...");
  const [usergender, setUsergender] = useState("");
  const [greeting, setGreeting] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // Track if greeting is playing

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

       const playGreeting = async (data: { gender: string }) => {
         if (isProcessing) {
           console.log("Greeting already in progress, ignoring new data...");
           return;
         }

         setIsProcessing(true); // Set processing to true
         setMessage("Ping received! Generating greeting...");

         const detectedGender = data.gender;
         setUsergender(detectedGender);

         try {
           const response = await fetch(
             "http://localhost:5000/ai_speech/generate-greeting",
             {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ text: detectedGender }), // Send the detected gender here
             }
           );

           if (!response.ok) {
             throw new Error(`Error from server: ${response.statusText}`);
           }

           const result = await response.json();
           const greetingText = result.text;
           setGreeting(greetingText);

           const utterance = new SpeechSynthesisUtterance(greetingText);

           const voices = speechSynthesis.getVoices();
           console.log(voices);

           const maleVoice =
             voices.find(
               (voice) =>
                 voice.name === "Microsoft Mark - English (United States)"
             ) || null;
           const femaleVoice =
             voices.find(
               (voice) =>
                 voice.name === "Microsoft Zira - English (United States)"
             ) || null;

           utterance.voice = aigender === "female" ? femaleVoice : maleVoice;

           utterance.onend = () => {
             console.log("Greeting finished playing.");
             setIsProcessing(false); // Reset processing state when greeting ends
           };

           speechSynthesis.speak(utterance);
         } catch (error) {
           console.error("Error generating or playing greeting:", error);
           setMessage("Failed to generate greeting.");
           setIsProcessing(false); // Reset processing state on error
         }
       };
       
    const handleDetection = (data: { gender?: string }) => {
      console.log("Received detection data:", data);

      if (data.gender) {
        setMessage(`Gender Detected: ${data.gender}`);
        setUsergender(data.gender);
      } else {
        setMessage("No Person Detected");
        setUsergender("");
      }
    };

    socket.on("detection", playGreeting);
    socket.on("detection", handleDetection);

    socket.on("disconnect", () => {
      console.log("Disconnected from server. Attempting to reconnect...");
      socket.connect();
    });

    return () => {
      socket.off("detection", playGreeting);
      // socket.off("detection", handleDetection);
      socket.disconnect();
    };
  }, [aigender]);

  return (
    <div>
      <div>{message}</div>
      {greeting && <div>Greeting: {greeting}</div>}
      {usergender && <div>Detected Gender: {usergender}</div>}
    </div>
  );
};

export default WebSocketGreeting;
