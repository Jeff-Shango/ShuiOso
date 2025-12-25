import React, { useState, useEffect } from "react";
import sanityClient from "../sanityClient";
// import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import GalleryBox from "./galleryBox";
// import PageWrapper from "./PageWrapper";

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Shuffle slideshow state
  const [playOrder, setPlayOrder] = useState([]);
  const [playPos, setPlayPos] = useState(0);

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

  // Fetch events + bio on load
  useEffect(() => {
    // Fetch events
    sanityClient
      .fetch(`*[_type == "event"]{ title, date, "image": image.asset->url }`)
      .then((data) => {
        setEvents(data);

        // initialize shuffle order so slideshow starts randomized
        if (data?.length > 0) {
          const order = makeShuffledOrder(data.length);
          setPlayOrder(order);
          setPlayPos(0);
          setCurrentIndex(order[0]); // start on a random first slide
        }
      })
      .catch((error) => console.error("Sanity Fetch Error:", error));

    // Fetch bio
    sanityClient
      .fetch(`*[_type == "bio"][0]`)
      .then((data) => setBio(data))
      .catch((error) => console.error("Bio Fetch Error:", error));
  }, []);

  // Shuffle slideshow interval (always cycles in random order)
  useEffect(() => {
    // Only run if we have > 1 event and a valid playOrder
    if (events.length > 1 && playOrder.length === events.length) {
      const interval = setInterval(() => {
        setPlayPos((prevPos) => {
          const nextPos = prevPos + 1;

          // If we hit the end, reshuffle and start over
          if (nextPos >= playOrder.length) {
            const newOrder = makeShuffledOrder(events.length);
            setPlayOrder(newOrder);
            setCurrentIndex(newOrder[0]);
            return 0;
          }

          // Otherwise advance to the next shuffled item
          setCurrentIndex(playOrder[nextPos]);
          return nextPos;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [events, playOrder]);

  const handleImageClick = () => {
    navigate("/events");
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

        {/* Gallery */}
        <GalleryBox />

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
              <button
                className="close-btn"
                onClick={() => setShowFullBio(false)}
              >
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
