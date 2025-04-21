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
  const sourceRef = useRef(null);
  const analyzerRef = useRef(null);

  // Sets audio src when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentTrackIndex].src;
    }
  }, [currentTrackIndex, songs]);

  const handlePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Setup audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    // Disconnect previous source
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch (e) {
        console.warn("Couldn't disconnect source:", e);
      }
      sourceRef.current = null;
    }

    // Setup new analyzer + connection
    if (!analyzerRef.current) {
      analyzerRef.current = audioContext.createAnalyser();
      analyzerRef.current.fftSize = 256;
    }

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyzerRef.current);
    analyzerRef.current.connect(audioContext.destination);
    sourceRef.current = source;

    // Setup visualizer
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);

    const renderFrame = () => {
      requestAnimationFrame(renderFrame);
      analyzerRef.current.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderPulse(ctx, dataArray, canvas);
    };

    renderFrame();

    // Play the audio
    try {
      await audio.play();
    } catch (err) {
      console.warn("Playback blocked:", err);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % songs.length);
    setTimeout(() => handlePlay(), 0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
    setTimeout(() => handlePlay(), 0);
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
              onClick={() => {
                setCurrentTrackIndex(index);
                setTimeout(() => handlePlay(), 0);
              }}
            >
              {song.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="audio-controls">
        <h3>{songs[currentTrackIndex].title}</h3>
        <audio ref={audioRef} controls onPlay={handlePlay} />
        <div className="track-buttons">
          <button className="nav-button" onClick={handlePrev}>⏮ Prev</button>
          <button className="nav-button" onClick={handleNext}>Next ⏭</button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
