"use client";

import React, {useContext, useEffect, useState, useRef} from "react";
import {io} from "socket.io-client";
import AvatarContext from "../avatar/avatar-context";

const WebSocketGreeting = ({
  setGreetingCallback,
  setTalking,
  setProcessing,
}: {

  setGreetingCallback: (greeting: string) => void;
  setTalking: (talking: boolean) => void;
  setProcessing: (talking: boolean) => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false); // State to track if processing
  const { tone } = useContext(AvatarContext);
  const toneRef = useRef(tone);
  const { voice } = useContext(AvatarContext)
  const voiceref = useRef(voice)

  useEffect(() => {
    toneRef.current = tone;
  }, [tone]);

  useEffect(() => {
     voiceref.current = voice;
    }, [voice]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    const playAudioBlob = async (audioBlob: Blob) => {
      const audioContext = new AudioContext();
      try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        return new Promise<void>((resolve) => {
          source.onended = () => {
            resolve(); // Resolve the promise when audio finishes playing
          };
          source.start();
        });
      } catch (error) {
        console.error("Error decoding or playing audio:", error);
        throw error;
      }
    };
    const playGreeting = async (data: {
      gender: string;
      time: any;
      emotion: any;
    }) => {
      if (isProcessing) return; // Ignore emit if already processing
      setIsProcessing(true); // Set processing state to true
      setGreetingCallback("Thinking...");
      console.log(tone);
      try {
        console.log("Processing detection data:", data);
        const response = await fetch(
          "http://localhost:5000/ai_speech/generate-greeting",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_gender: data.gender,
              time: data.time,
              emotion: data.emotion,
              tone: tone,
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
            body: JSON.stringify({ text: greetingText, gender: voice }),
          }
        );
        if (!ttsResponse.ok) {
          throw new Error("Error fetching audio.");
        }
        const audioBlob = await ttsResponse.blob();
        // Save the greeting in the parent via callback
        setGreetingCallback(greetingText);
        setTalking(true);
        setProcessing(true);
        await playAudioBlob(audioBlob);
      } catch (error) {
        console.error("Error generating or playing greeting:", error);
      } finally {
        setIsProcessing(false); // Reset processing state after completion
        setProcessing(false)
        setTalking(false);
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
  }, [setGreetingCallback, isProcessing, tone, voice]);
  return null; // Component runs in the background and is invisible
};

export default WebSocketGreeting;