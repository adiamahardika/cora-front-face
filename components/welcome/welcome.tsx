"use client";

import React, { useEffect } from "react";
import { io } from "socket.io-client";

const WebSocketGreeting = ({
  aigender,
  setGreetingCallback,
}: {
  aigender: string;
  setGreetingCallback: (greeting: string) => void;
}) => {
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    const playAudioBlob = async (audioBlob: Blob) => {
      const audioContext = new AudioContext();

      try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
      } catch (error) {
        console.error("Error decoding or playing audio:", error);
      }
    };

    const playGreeting = async (data: { gender: string; time: any }) => {
      console.log("Processing detection data:", data);
      try {
        const response = await fetch(
          "http://localhost:5000/ai_speech/generate-greeting",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: data.gender, time: data.time }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error from server: ${response.statusText}`);
        }

        const result = await response.json();
        const greetingText = result.text;

        // Save the greeting in the parent via callback
        setGreetingCallback(greetingText);

        const ttsResponse = await fetch(
          "http://localhost:5000/ai_speech/generate-audio",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: greetingText, gender: aigender }), // Use greetingText directly
          }
        );

        if (!ttsResponse.ok) {
          throw new Error("Error fetching audio.");
        }

        const audioBlob = await ttsResponse.blob();
        await playAudioBlob(audioBlob);
      } catch (error) {
        console.error("Error generating or playing greeting:", error);
      }
    };

    socket.on("detection", playGreeting);

    return () => {
      socket.off("detection", playGreeting); // Proper cleanup
      socket.disconnect();
    };
  }, [aigender, setGreetingCallback]);

  return null; // Component runs in the background and is invisible
};

export default WebSocketGreeting;
