import React, { useEffect, useRef, useState, useMemo } from "react";
import "../styles/MusicPlayer.css";

const MusicPlayer = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const songs = useMemo(() => [
    { title: "Imagination", src: "/audio/Imagination.mp3" },
    { title: "Right Thing", src: "/audio/RightThing.mp3" },
    { title: "Commander Meat", src: "/audio/CommanderMeat.mp3" },
  ], []);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyzerRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;

    if (!analyzerRef.current) {
      analyzerRef.current = audioContext.createAnalyser();
      analyzerRef.current.fftSize = 256;
    }

    if (!sourceRef.current) {
      sourceRef.current = audioContext.createMediaElementSource(audio);
      sourceRef.current.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContext.destination);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyzer = analyzerRef.current;
    const dataArray = new Uint8Array(analyzer.frequencyBinCount);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const renderFrame = () => {
      requestAnimationFrame(renderFrame);
      analyzer.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderPulse(ctx, dataArray, canvas);
    };

    renderFrame();

    // Set song src and try to play
    audio.src = songs[currentTrackIndex].src;
    audio.load();
    audio
      .play()
      .catch((err) => console.warn("Autoplay blocked:", err));
  }, [currentTrackIndex, songs]);

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };

  const renderPulse = (ctx, dataArray, canvas) => {
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
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
        <audio ref={audioRef} controls preload="auto" />
        <div className="track-buttons">
          <button className="nav-button" onClick={handlePrev}>⏮ Prev</button>
          <button className="nav-button" onClick={handleNext}>Next ⏭</button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
