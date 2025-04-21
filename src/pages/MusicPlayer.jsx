import React, { useEffect, useRef, useState } from "react";
import "../styles/MusicPlayer.css";
import Imagination from "../assets/audio/Imagination.wav";
import RightThing from "../assets/audio/RightThing.wav";
import CommanderMeat from "../assets/audio/CommanderMeat.wav";

const MusicPlayer = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const songs = [
    { title: "Imagination", src: Imagination },
    { title: "Right Thing", src: RightThing },
    { title: "Commander Meat", src: CommanderMeat },
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyzerRef = useRef(null);

  // One-time setup for audio context + analyzer
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaElementSource(audio);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;

    source.connect(analyzer);
    analyzer.connect(audioContext.destination);

    sourceRef.current = source;
    analyzerRef.current = analyzer;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const renderFrame = () => {
      requestAnimationFrame(renderFrame);
      analyzer.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderPulse(ctx, dataArray, canvas);
    };

    renderFrame();
  }, []);

  // Change song src and play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = songs[currentTrackIndex].src;
    audio.load();

    // Resume context (in case it's suspended)
    const tryPlay = async () => {
      try {
        if (audioContextRef.current?.state === "suspended") {
          await audioContextRef.current.resume();
        }
        await audio.play();
      } catch (err) {
        console.warn("Playback blocked:", err);
      }
    };

    tryPlay();
  }, [currentTrackIndex, songs]); // ✅ added `songs` here to fix ESLint error

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
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
              onClick={() => setCurrentTrackIndex(index)}
            >
              {song.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="audio-controls">
        <h3>{songs[currentTrackIndex].title}</h3>
        <audio ref={audioRef} controls />
        <div className="track-buttons">
          <button className="nav-button" onClick={handlePrev}>⏮ Prev</button>
          <button className="nav-button" onClick={handleNext}>Next ⏭</button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
