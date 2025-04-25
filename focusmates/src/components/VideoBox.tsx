/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// Extend the Window interface to include JitsiMeetExternalAPI
declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

import { useEffect, useRef } from "react";

interface VideoBoxProps {
  sessionId: string;
  userName: string;
}

export default function VideoBox({ sessionId, userName }: VideoBoxProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadJitsiScript = () => {
      if (window.JitsiMeetExternalAPI) {
        initJitsi();
      } else {
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = initJitsi;
        document.body.appendChild(script);
      }
    };

    const initJitsi = () => {
      const domain = "meet.jit.si";
      const options = {
        roomName: `FocusMates-${sessionId}`,
        parentNode: jitsiContainerRef.current,
        width: "100%",
        height: "100%",
        configOverwrite: {
          startWithAudioMuted: false,
          disableModeratorIndicator: true
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false
        },
        userInfo: {
          displayName: userName || "Anonymous Student"
        }
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);
      api.addListener("participantJoined", (participant: any) => {
        console.log("Participant joined:", participant.displayName || participant.id);
      });
    };

    const container = jitsiContainerRef.current;
    loadJitsiScript();

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [sessionId, userName]);

  return <div ref={jitsiContainerRef} className="w-full h-full rounded-md overflow-hidden" />;
}
