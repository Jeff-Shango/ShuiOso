import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';
import logoImage from './assets/photos/CandiKrushLogo.PNG'; // update path as needed

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo-and-toggle">
          <Link to="/" className="navbar-logo">
            {/* 👇 Show full text on desktop */}
            <span className="logo-text">DJ CANDIKRUSH "CANDACE"</span>

            {/* 👇 Show image logo on mobile */}
            <img
              src={logoImage}
              alt="DJ Candikrush Logo"
              className="logo-image"
            />
          </Link>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation"
          >
            ☰
          </button>
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Let's Talk</Link></li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;
