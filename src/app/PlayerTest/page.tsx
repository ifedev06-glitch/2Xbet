"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Hook to load YouTube API once
function useYouTubeAPI() {
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    if (window.YT) {
      setApiReady(true);
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  return apiReady;
}

const CustomYouTubePlayer: React.FC<{ videoId: string }> = ({ videoId }) => {
  const apiReady = useYouTubeAPI();
  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!apiReady) return;

    playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
      videoId,
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => setPlayerReady(true),
        onStateChange: (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        },
      },
    });
  }, [apiReady, videoId]);

  const togglePlay = () => {
    if (!playerReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        position: "relative",
        width: "640px",
        maxWidth: "90%",
        height: "360px",
        border: "4px solid #ddd",
        borderRadius: "16px",
        overflow: "hidden",
        margin: "50px auto",
        padding: "16px",
        boxSizing: "border-box",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div id={`youtube-player-${videoId}`} style={{ width: "100%", height: "100%" }} />

      {/* Transparent overlay to hide YouTube controls */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "transparent",
          zIndex: 2,
        }}
      />

      {/* Center Play/Pause Button */}
      {(hover || !isPlaying) && (
        <button
          onClick={togglePlay}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 3,
            padding: "16px 28px",
            background: "rgba(0, 112, 243, 0.9)",
            color: "white",
            fontSize: "1.2rem",
            fontWeight: "bold",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.background = "rgba(0, 80, 200, 1)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.background = "rgba(0, 112, 243, 0.9)";
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      )}
    </div>
  );
};

const SingleVideo: React.FC = () => {
  return (
    <div
      style={{
        background: "#e0e0e0",
        minHeight: "100vh",
        padding: "50px 24px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "32px",
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#000",
        }}
      >
        Test Courses
      </h1>

      <CustomYouTubePlayer videoId="MTHGoGUFpvE" />
    </div>
  );
};

export default SingleVideo;
