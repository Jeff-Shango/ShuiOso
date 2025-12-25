import React, { useEffect, useMemo, useState } from "react";
import sanityClient from "../sanityClient";
import "../styles/galleryBox.css";
import { useLocation } from "react-router-dom"; // ✅ add this

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
  const location = useLocation(); // ✅ add this

  // ✅ key line: if prop not provided, fall back to router state
  const selectedId = preselectId || location.state?.preselectId || null;

  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null); // track by id (stable)

  // Fetch gallery
  useEffect(() => {
    sanityClient
      .fetch(GALLERY_QUERY)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Gallery fetch error:", err));
  }, []);

  // OPTIONAL: shuffle for display, but selection is by id so it's safe
  const displayItems = useMemo(() => shuffleArray(items), [items]);

  // ✅ Set active image when coming from LandingPage
  useEffect(() => {
    if (!selectedId) return;
    if (!items.length) return;
    setActiveId(selectedId);
  }, [selectedId, items.length]);

  // Find active item + active index in the DISPLAY list (for arrows)
  const activeIndex = useMemo(() => {
    if (!activeId) return null;
    const idx = displayItems.findIndex((it) => it._id === activeId);
    return idx >= 0 ? idx : null;
  }, [activeId, displayItems]);

  const activeItem =
    activeIndex === null ? null : displayItems[activeIndex] || null;

  // Keyboard support (ESC close, arrows nav)
  useEffect(() => {
    if (!activeItem) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setActiveId(null);

      if (e.key === "ArrowRight" && displayItems.length > 0) {
        const nextIdx = (activeIndex + 1) % displayItems.length;
        setActiveId(displayItems[nextIdx]._id);
      }

      if (e.key === "ArrowLeft" && displayItems.length > 0) {
        const prevIdx =
          (activeIndex - 1 + displayItems.length) % displayItems.length;
        setActiveId(displayItems[prevIdx]._id);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeItem, activeIndex, displayItems]);

  if (!displayItems.length) return null;

  return (
    <section className="gallery-section">
      <h2 className="gallery-title">Gallery</h2>

      <div className="gallery-grid">
        {displayItems.map((it) => (
          <button
            key={it._id}
            className="gallery-tile"
            onClick={() => setActiveId(it._id)}
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
        <div className="lightbox" onClick={() => setActiveId(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setActiveId(null)}
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

            {displayItems.length > 1 && (
              <div className="lightbox-nav">
                <button
                  className="nav-btn"
                  onClick={() => {
                    const prevIdx =
                      (activeIndex - 1 + displayItems.length) %
                      displayItems.length;
                    setActiveId(displayItems[prevIdx]._id);
                  }}
                >
                  ←
                </button>
                <button
                  className="nav-btn"
                  onClick={() => {
                    const nextIdx = (activeIndex + 1) % displayItems.length;
                    setActiveId(displayItems[nextIdx]._id);
                  }}
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
