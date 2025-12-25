import React, { useEffect, useMemo, useState } from "react";
import sanityClient from "../sanityClient";
import "../styles/galleryBox.css";

const GALLERY_QUERY = `*[_type == "galleryItem"] | order(_createdAt desc){
  _id,
  title,
  caption,
  "image": image.asset->url
}`;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GalleryBox({ preselectId = null }) {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(GALLERY_QUERY)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Gallery fetch error:", err));
  }, []);

  // Optional: keep gallery order shuffled on each load
  const shuffledItems = useMemo(() => shuffleArray(items), [items]);

  const activeItem =
    activeIndex === null ? null : shuffledItems[activeIndex] || null;

  // If a preselectId is provided (from LandingPage click), open that image
  useEffect(() => {
    if (!preselectId) return;
    if (!shuffledItems.length) return;

    const idx = shuffledItems.findIndex((it) => it._id === preselectId);
    if (idx >= 0) setActiveIndex(idx);
  }, [preselectId, shuffledItems]);

  // Keyboard support (ESC close, arrows nav)
  useEffect(() => {
    if (!activeItem) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i + 1) % shuffledItems.length);
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i - 1 + shuffledItems.length) % shuffledItems.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeItem, shuffledItems.length]);

  if (!shuffledItems.length) return null;

  return (
    <section className="gallery-section">
      <h2 className="gallery-title">Gallery</h2>

      <div className="gallery-grid">
        {shuffledItems.map((it, idx) => (
          <button
            key={it._id}
            className="gallery-tile"
            onClick={() => setActiveIndex(idx)}
            aria-label={it.title ? `Open ${it.title}` : "Open image"}
          >
            <img
              src={it.image}
              alt={it.title || it.caption || "Gallery image"}
              loading="lazy"
              className="gallery-img"
            />
          </button>
        ))}
      </div>

      {activeItem && (
        <div className="lightbox" onClick={() => setActiveIndex(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <img
              src={activeItem.image}
              alt={activeItem.title || activeItem.caption || "Gallery image"}
              className="lightbox-img"
            />

            {(activeItem.title || activeItem.caption) && (
              <div className="lightbox-caption">
                {activeItem.title && (
                  <div className="cap-title">{activeItem.title}</div>
                )}
                {activeItem.caption && (
                  <div className="cap-text">{activeItem.caption}</div>
                )}
              </div>
            )}

            {shuffledItems.length > 1 && (
              <div className="lightbox-nav">
                <button
                  className="nav-btn"
                  onClick={() =>
                    setActiveIndex((i) => (i - 1 + shuffledItems.length) % shuffledItems.length)
                  }
                >
                  ←
                </button>
                <button
                  className="nav-btn"
                  onClick={() =>
                    setActiveIndex((i) => (i + 1) % shuffledItems.length)
                  }
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
