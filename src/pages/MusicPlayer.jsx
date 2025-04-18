import React, { useEffect, useRef, useState } from "react";
import "../styles/MusicPlayer.css"
import Imagination from "../assets/audio/Imagination.wav"

const MusicPlayer = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const [effectType, setEffectType] = useState("bars");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const audio = audioRef.current;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyzer = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);
    analyzer.fftSize = 256; // Defines the frequency bin count

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const renderFrame = () => {
      requestAnimationFrame(renderFrame);
      analyzer.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (effectType === "bars") {
        renderBars(ctx, dataArray, canvas);
      } else if (effectType === "waveform") {
        renderWaveform(ctx, dataArray, canvas);
      } else if (effectType === "radial") {
        renderRadial(ctx, dataArray, canvas);
      }
    };

    renderFrame();
  }, [effectType]); // Re-run effect when effectType changes

  // 🔹 Bar Visualizer (Classic)
  const renderBars = (ctx, dataArray, canvas) => {
    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = dataArray[i] / 2;
      ctx.fillStyle = `rgb(${barHeight + 100}, 50, 200)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 2;
    }
  };

  // 🔹 Waveform Visualizer (Oscilloscope)
  const renderWaveform = (ctx, dataArray, canvas) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(0, 255, 255)";
    ctx.beginPath();

    let sliceWidth = canvas.width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      let v = dataArray[i] / 128.0;
      let y = v * (canvas.height / 2);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  // 🔹 Radial Visualizer (Circular)
  const renderRadial = (ctx, dataArray, canvas) => {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    let radius = 100;
    let barWidth = 4;

    for (let i = 0; i < dataArray.length; i++) {
      let barHeight = dataArray[i] / 2;
      let angle = (i * Math.PI * 2) / dataArray.length;

      ctx.save();
      ctx.rotate(angle);
      ctx.fillStyle = `rgb(${barHeight + 100}, 50, 200)`;
      ctx.fillRect(radius, 0, barWidth, -barHeight);
      ctx.restore();
    }

    ctx.resetTransform();
  };

  return (
    <div className="music-player-container">
      {/* Visualizer Canvas */}
      <canvas ref={canvasRef} className="visualizer"></canvas>

      {/* Music Player Controls */}
      <div className="audio-controls">
        <audio ref={audioRef} controls>
          <source src={Imagination} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>

      {/* Buttons to Switch Visualizer Mode */}
      <div className="visualizer-controls">
        <button onClick={() => setEffectType("bars")}>Bars</button>
        <button onClick={() => setEffectType("waveform")}>Waveform</button>
        <button onClick={() => setEffectType("radial")}>Radial</button>
      </div>

      {/* Mixcloud Embed */}
      <div className="mixcloud-player">
        <iframe
          title="MixCloud"
          width="100%"
          height="120"
          src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FDjCandikrush%2F"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

export default MusicPlayer;
