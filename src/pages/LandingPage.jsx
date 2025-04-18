import React, { useState, useEffect } from "react";
import sanityClient from "../sanityClient";
// import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const [bio, setBio] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch events
    sanityClient
      .fetch(`*[_type == "event"]{ title, date, "image": image.asset->url }`)
      .then((data) => setEvents(data))
      .catch((error) => console.error("Sanity Fetch Error:", error));
  
    // Fetch bio
    sanityClient
      .fetch(`*[_type == "bio"][0]`)
      .then((data) => setBio(data))
      .catch((error) => console.error("Bio Fetch Error:", error));
  }, []);
  

  useEffect(() => {
    if (events.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [events]);

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

{/* Floating Music Player */}
<div className="floating-player">
  <iframe
    title="MixCloud"
    
    width="100%"
    height="60"
    src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FDjCandikrush%2F"
    frameBorder="0"
    allow="autoplay"
  ></iframe>
</div>




        {/* Bio Section - Full (Desktop) */}
        {bio && (
          <div className="bio-section full-bio-desktop">
            <p className="bio-title">DJ CANDIKRUSH</p>
            <p>{bio.short}</p>
            <button className="see-more" onClick={() => setShowFullBio(true)}>
              Click to see more
            </button>
          </div>
        )}



        {/* Bio Section - Compact with "See more…" (Mobile/Tablet) */}
        {bio && (
          <div className="bio-section short-bio-mobile">
            <p className="bio-title">DJ CANDIKRUSH</p>
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
              {bio.full.split('\n').map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
  </div>
)}


      </div>

      {events.length === 0 && <p style={{ color: 'white' }}>No events loaded.</p>}
{!bio && <p style={{ color: 'white' }}>No bio loaded.</p>}

    </>
    
  );
};

export default LandingPage;
