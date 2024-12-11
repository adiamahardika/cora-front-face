import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const WebSocketGreeting = ({ aigender }: { aigender: string }) => {
  const [message, setMessage] = useState("Waiting for greeting...");
  const [usergender, setUsergender] = useState("");
  const [greeting, setGreeting] = useState("");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Using useRef to persist the processing state across renders without causing re-renders
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

 
  const initializeAudioContext = () => {
    if (!audioContext) {
      const context = new AudioContext();
      setAudioContext(context);
      console.log("AudioContext initialized");
    } else if (audioContext.state === "suspended") {
      audioContext.resume().then(() => {
        console.log("AudioContext resumed");
      });
    }
  };

    const playAudioStream = (audioChunk: ArrayBuffer) => {
      if (!audioContext) return;

      audioContext.decodeAudioData(audioChunk, (buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
      });
    };

    const playGreeting = async (data: { gender: string; time: string }) => {
      if (isProcessingRef.current) {
        console.log("Greeting is already being processed, skipping...");
        return;
      }

      isProcessingRef.current = true; // Set the flag to true before processing
      setMessage("Generating greeting...");

      try {
        // Step 1: Generate the greeting text
        const response = await fetch(
          "http://localhost:5000/ai_speech/generate-greeting",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: data.gender, time: data.time }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error generating greeting: ${response.statusText}`);
        }

        const result = await response.json();
        const greetingText = result.text;
        setGreeting(greetingText);

        console.log("Generated Greeting:", greetingText);

        // Step 2: Send the text to TTS endpoint and play audio in real time
        initializeAudioContext();

        const ttsResponse = await fetch(
          "http://localhost:5000/ai_speech/generate-audio",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: greetingText, gender: aigender }), // Replace with dynamic text
          }
        );

        if (!ttsResponse.body) {
          throw new Error("No audio stream received.");
        }

        const reader = ttsResponse.body.getReader();

        const readStream = async () => {
          let done = false;

          while (!done) {
            const { value, done: isDone } = await reader.read();
            if (value) {
              //@ts-ignore
              playAudioStream(value.buffer);
            }
            done = isDone;
          }
        };

        await readStream();

        isProcessingRef.current = false; // Reset the flag after processing is done
        setMessage("Greeting playback completed.");
        console.log("Greeting playback completed.");
      } catch (error) {
        console.error("Error during greeting or playback:", error);
        setMessage("Error generating greeting.");
        isProcessingRef.current = false; // Reset the flag on error as well
      }
    };

    socket.on("detection", playGreeting);

    socket.on("disconnect", () => {
      console.log("Disconnected from server. Reconnecting...");
      socket.connect();
    });

    return () => {
      socket.off("detection", playGreeting);
      socket.disconnect();
    };
  }, [aigender, audioContext]);

  return (
    <div>
      <div>{message}</div>
      {greeting && <div>Greeting: {greeting}</div>}
      {usergender && <div>Detected Gender: {usergender}</div>}
    </div>
  );
};

export default WebSocketGreeting;
