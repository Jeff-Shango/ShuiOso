import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";

const GALLERY_QUERY = `*[_type == "galleryItem"] | order(_createdAt desc){
  _id,
  title,
  caption,
  eventDate,
  tags,
  "imageUrl": image.asset->url
}`;

export default function GalleryBox() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(GALLERY_QUERY)
      .then((data) => setItems(data || []))
      .catch((error) => console.error("Gallery fetch error:", error));
  }, []);

  if (!items.length) {
    return (
      <section style={{ marginTop: 24 }}>
        <h2>Gallery</h2>
        <p style={{ opacity: 0.75 }}>No gallery images yet.</p>
      </section>
    );
  }

  return (
    <section style={{ marginTop: 24 }}>
      <h2>Gallery</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        {items.map((it) => (
          <button
            key={it._id}
            onClick={() => setActive(it)}
            style={{
              border: "none",
              padding: 0,
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
            }}
            aria-label={`Open ${it.title || "gallery image"}`}
          >
            <img
              src={it.imageUrl}
              alt={it.title || it.caption || "Gallery image"}
              loading="lazy"
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 12,
              }}
            />
            {(it.title || it.caption) && (
              <div style={{ marginTop: 6, opacity: 0.9 }}>
                {it.title && <div style={{ fontWeight: 600 }}>{it.title}</div>}
                {it.caption && (
                  <div style={{ fontSize: 13, opacity: 0.8 }}>{it.caption}</div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* simple lightbox */}
      {active && (
        <div
          onClick={() => setActive(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 900, width: "100%" }}
          >
            <img
              src={active.imageUrl}
              alt={active.title || active.caption || "Gallery image"}
              style={{ width: "100%", borderRadius: 16 }}
            />
            {(active.title || active.caption) && (
              <div style={{ marginTop: 10 }}>
                {active.title && (
                  <div style={{ fontWeight: 700 }}>{active.title}</div>
                )}
                {active.caption && <div style={{ opacity: 0.85 }}>{active.caption}</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
