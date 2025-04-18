import React, { useState, useEffect } from "react";
import sanityClient from "../sanityClient"; 
import "../styles/EventShowcase.css"; 
// import { FaInstagram, FaMixcloud } from "react-icons/fa"; 

const EventShowcase = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "event"]{ title, date, "image": image.asset->url }`)
      .then((data) => {
        const today = new Date().toISOString().split("T")[0];

        setUpcomingEvents(data.filter(event => event.date >= today).sort((a, b) => new Date(a.date) - new Date(b.date)));
        setPastEvents(data.filter(event => event.date < today).sort((a, b) => new Date(b.date) - new Date(a.date)));
      })
      .catch((error) => console.error("Sanity Fetch Error:", error));
  }, []);

  return (
    <div className="event-showcase">
      <h1>Upcoming Events</h1>
      {upcomingEvents.length > 0 ? (
        <ul className="upcoming-list">
          {upcomingEvents.map((event, index) => (
            <li key={index} className="event-item">
              <img src={event.image} alt={event.title} className="event-image" />
              <div>
                <h3>{event.title}</h3>
                <p>{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming events at the moment.</p>
      )}

      <div className="past-events-section">
        <button className="toggle-past-events" onClick={() => setShowPastEvents(!showPastEvents)}>
          {showPastEvents ? "Hide Past Shows" : "View Past Shows"}
        </button>
        {showPastEvents && (
          <ul className="past-list">
            {pastEvents.map((event, index) => (
              <li key={index} className="event-item past">
                <img src={event.image} alt={event.title} className="event-image" />
                <div>
                  <h3>{event.title}</h3>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventShowcase;
