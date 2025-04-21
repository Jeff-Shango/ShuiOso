import React, { useEffect, useRef, useState, useMemo } from "react";
import "../styles/MusicPlayer.css";

const MusicPlayer = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const songs = useMemo(() => [
    { title: "Imagination", src: "/audio/Imagination.wav" },
    { title: "Right Thing", src: "/audio/RightThing.wav" },
    { title: "Commander Meat", src: "/audio/CommanderMeat.wav" },
  ], []);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);

  // Initial setup: one-time analyzer + source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    analyzerRef.current = analyzer;

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dataArray = new Uint8Array(analyzer.frequencyBinCount);

    const renderFrame = () => {
      requestAnimationFrame(renderFrame);
      analyzer.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderPulse(ctx, dataArray, canvas);
    };

    renderFrame();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentTrackIndex].src;
      audioRef.current.load();
    }
  }, [currentTrackIndex, songs]);

  const handlePlay = async () => {
    const audio = audioRef.current;
    const context = audioContextRef.current;

    try {
      if (context?.state === "suspended") {
        await context.resume();
      }
      await audio.play();
    } catch (err) {
      console.warn("Playback blocked:", err);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % songs.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) =>
      prev === 0 ? songs.length - 1 : prev - 1
    );
  };

  const renderPulse = (ctx, dataArray, canvas) => {
    const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
    const radius = average * 1.5;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(${100 + radius}, 0, 255, 0.3)`;
    ctx.fill();
  };

  return (
    <div className="music-player-container">
      <canvas ref={canvasRef} className="visualizer"></canvas>

      <div className="song-list">
        <ul>
          {songs.map((song, index) => (
            <li
              key={index}
              className={`song-list-item ${
                index === currentTrackIndex ? "active" : ""
              }`}
              onClick={() => {
                setCurrentTrackIndex(index);
              }}
            >
              {song.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="audio-controls">
        <h3>{songs[currentTrackIndex].title}</h3>
        <audio ref={audioRef} controls preload="auto" onPlay={handlePlay} />
        <div className="track-buttons">
          <button className="nav-button" onClick={() => { handlePrev(); }}>⏮ Prev</button>
          <button className="nav-button" onClick={() => { handleNext(); }}>Next ⏭</button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
