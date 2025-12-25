import React, { useState, useEffect } from "react";
import sanityClient from "../sanityClient";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Shuffle slideshow state for EVENTS
  const [playOrder, setPlayOrder] = useState([]);
  const [, setPlayPos] = useState(0);

  // Gallery spotlight slideshow
  const [galleryItems, setGalleryItems] = useState([]);
  const [gallerySpotlightIndex, setGallerySpotlightIndex] = useState(0);

  // Bio state
  const [showFullBio, setShowFullBio] = useState(false);
  const [bio, setBio] = useState(null);

  const navigate = useNavigate();

  // Helper: creates a randomized order of indices [0..n-1]
  const makeShuffledOrder = (n) => {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Fetch events + bio + gallery spotlight list on load
  useEffect(() => {
    // Fetch gallery items for spotlight
    sanityClient
      .fetch(`*[_type == "galleryItem"]{ _id, "image": image.asset->url }`)
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        // shuffle once so spotlight starts randomized
        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
        }
        setGalleryItems(items);
        setGallerySpotlightIndex(0);
      })
      .catch((err) => console.error("Gallery Spotlight fetch error:", err));

    // Fetch events
    sanityClient
      .fetch(`*[_type == "event"]{ title, date, "image": image.asset->url }`)
      .then((data) => {
        const safe = Array.isArray(data) ? data : [];
        setEvents(safe);

        // initialize shuffle order so events slideshow starts randomized
        if (safe.length > 0) {
          const order = makeShuffledOrder(safe.length);
          setPlayOrder(order);
          setPlayPos(0);
          setCurrentIndex(order[0]);
        }
      })
      .catch((error) => console.error("Sanity Fetch Error:", error));

    // Fetch bio
    sanityClient
      .fetch(`*[_type == "bio"][0]`)
      .then((data) => setBio(data))
      .catch((error) => console.error("Bio Fetch Error:", error));
  }, []);

  // Gallery spotlight interval
  useEffect(() => {
    if (galleryItems.length > 1) {
      const interval = setInterval(() => {
        setGallerySpotlightIndex((i) => (i + 1) % galleryItems.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [galleryItems.length]);

  // Shuffle EVENTS slideshow interval (always cycles in random order)
  useEffect(() => {
    if (events.length > 1 && playOrder.length === events.length) {
      const interval = setInterval(() => {
        setPlayPos((prevPos) => {
          const nextPos = prevPos + 1;

          // End reached → reshuffle + start over
          if (nextPos >= playOrder.length) {
            const newOrder = makeShuffledOrder(events.length);
            setPlayOrder(newOrder);
            setCurrentIndex(newOrder[0]);
            return 0;
          }

          setCurrentIndex(playOrder[nextPos]);
          return nextPos;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [events.length, playOrder]);

  const handleImageClick = () => {
    navigate("/events");
  };

  const handleGallerySpotlightClick = () => {
    const active = galleryItems[gallerySpotlightIndex];

    // If we don't have an id for some reason, just go to the gallery page
    if (!active?._id) {
      navigate("/gallery");
      return;
    }

    // Pass the clicked image id to Gallery page so it opens/highlights it
    navigate("/gallery", { state: { preselectId: active._id } });
  };

  return (
    <>
      <div className="landing-page">
        {/* Event Slider */}
        {events.length > 0 && (
          <img
            className="event-image"
            src={events[currentIndex]?.image}
            alt={events[currentIndex]?.title}
            onClick={handleImageClick}
          />
        )}

        <div className="event-caption" onClick={handleImageClick}>
          <h2>{events[currentIndex]?.title}</h2>
        </div>

        <div className="see-events-btn-container">
          <button className="see-events-btn" onClick={handleImageClick}>
            🎶 View Full Lineup
          </button>
        </div>

        {/* Gallery Spotlight Slideshow (one box) */}
        {galleryItems.length > 0 && (
          <div
            className="gallery-spotlight"
            onClick={handleGallerySpotlightClick}
            role="button"
            tabIndex={0}
          >
            <img
              className="gallery-spotlight-img"
              src={galleryItems[gallerySpotlightIndex]?.image}
              alt="Gallery spotlight"
              loading="lazy"
            />
          </div>
        )}

        {/* Floating Music Player */}
        <div className="floating-player">
          <iframe
            title="mixcloud"
            width="100%"
            height="120"
            src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2FShuiOso%2F"
            frameBorder="0"
          />
        </div>

        {/* Bio Section - Full (Desktop) */}
        {bio && (
          <div className="bio-section full-bio-desktop">
            <p className="bio-title">Shui Oso</p>
            <p>{bio.short}</p>
            <button className="see-more" onClick={() => setShowFullBio(true)}>
              Click to see more
            </button>
          </div>
        )}

        {/* Bio Section - Compact with "See more…" (Mobile/Tablet) */}
        {bio && (
          <div className="bio-section short-bio-mobile">
            <p className="bio-title">Shui Oso</p>
            <p>
              {bio.short}
              <span className="see-more" onClick={() => setShowFullBio(true)}>
                {" "}
                See more...
              </span>
            </p>
          </div>
        )}

        {/* Fullscreen Modal */}
        {showFullBio && bio && (
          <div className="full-bio-overlay">
            <div className="full-bio-content">
              <button className="close-btn" onClick={() => setShowFullBio(false)}>
                ✕
              </button>
              <h2>{bio.heading}</h2>
              {bio.full.split("\n").map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {events.length === 0 && <p style={{ color: "white" }}>No events loaded.</p>}
      {!bio && <p style={{ color: "white" }}>No bio loaded.</p>}
    </>
  );
};

export default LandingPage;
