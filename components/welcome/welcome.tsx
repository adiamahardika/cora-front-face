"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const WebSocketGreeting = ({
  aigender,
  setGreetingCallback,
}: {
  aigender: string;
  setGreetingCallback: (greeting: string) => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false); // State to track if processing

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

    const playGreeting = async (data: {
      gender: string;
      time: any;
      emotion: any;
    }) => {
      if (isProcessing) return; // Ignore emit if already processing
      setIsProcessing(true); // Set processing state to true

      try {
        console.log("Processing detection data:", data);
        const response = await fetch(
          "http://localhost:5000/ai_speech/generate-greeting",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: data.gender,
              time: data.time,
              emotion: data.emotion,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error from server: ${response.statusText}`);
        }

        const result = await response.json();
        const greetingText = result.text;

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
        // Save the greeting in the parent via callback
        setGreetingCallback(greetingText);
        await playAudioBlob(audioBlob);
      } catch (error) {
        console.error("Error generating or playing greeting:", error);
      } finally {
        setIsProcessing(false); // Reset processing state after completion
      }
    };

    const handleDetection = (data: {
      gender: string;
      time: any;
      emotion: any;
    }) => {
      if (!isProcessing) {
        playGreeting(data);
      }
    };

    socket.on("detection", handleDetection);

    return () => {
      socket.off("detection", handleDetection); // Proper cleanup
      socket.disconnect();
    };
  }, [aigender, setGreetingCallback, isProcessing]);

  return null; // Component runs in the background and is invisible
};

export default WebSocketGreeting;
