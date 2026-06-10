import { useState, useEffect, useRef, useCallback } from "react";

const DEEPGRAM_API_KEY = "7f17f4cd00b1fa33ce89f87d918380208f18655f";

const useVoiceToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const accumulatedRef = useRef("");

  const isSupported = !!(
    typeof window !== "undefined" &&
    navigator.mediaDevices?.getUserMedia &&
    window.MediaRecorder &&
    window.WebSocket
  );

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError("Voice recording features are not supported by this browser.");
      return;
    }

    setTranscript("");
    setError(null);
    accumulatedRef.current = "";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const socket = new WebSocket(
        "wss://api.deepgram.com/v1/listen?model=nova-2&interim_results=true&smart_formatting=true&endpointing=300",
        ["token", DEEPGRAM_API_KEY]
      );
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("Connected securely to universal transcription server.");
        setIsListening(true);

        let options = { mimeType: "audio/webm" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: "audio/mp4" };
        }
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = {};
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        mediaRecorder.start(200); 
      };

      socket.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const alternative = received.channel?.alternatives?.[0];
        
        if (alternative && alternative.transcript) {
          const currentText = alternative.transcript;

          if (received.is_final) {
            accumulatedRef.current += currentText + " ";
            setTranscript(accumulatedRef.current.trim());
          } else {
            setTranscript((accumulatedRef.current + currentText).trim());
          }
        }
      };

      socket.onerror = (err) => {
        console.error("Transcription stream error:", err);
        setError("Network connection to the streaming server failed.");
      };

      socket.onclose = () => {
        console.log("Streaming socket connection closed.");
        setIsListening(false);
      };

    } catch (err) {
      console.error("Failed to initialize universal speech stream:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Microphone access permission was denied.");
      } else {
        setError("Could not establish access to local audio inputs.");
      }
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    setIsListening(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch {}
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try { 
        socketRef.current.send(JSON.stringify({ type: "CloseStream" })); 
        socketRef.current.close();
      } catch {}
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    mediaRecorderRef.current = null;
    socketRef.current = null;
    streamRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        try { socketRef.current.close(); } catch {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { isListening, transcript, error, isSupported, startListening, stopListening };
};

export default useVoiceToText;