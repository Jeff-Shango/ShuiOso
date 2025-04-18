import React from "react";
import emailjs from "emailjs-com";
import { FaInstagram, FaMixcloud } from "react-icons/fa"; // Social Icons
import "./styles/App.css"; // Global Styles

const Footer = () => {
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_heulnra", 
      "template_hyqtg4k", 
      e.target, 
      "C3hNudHol2HbPpoBm"
    ).then(
      () => {
        alert("Message sent successfully!");
      },
      (error) => {
        alert("Failed to send message. Please try again.");
        console.error("Email send error:", error.text);
      }
    );

    e.target.reset();
  };

  return (
    <footer className="site-footer">
      {/* Social Media Links */}
      <div className="social-links">
        <a href="https://www.instagram.com/dj_candikrush.ckrushskate/" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={30} />
        </a>
        <a href="https://www.mixcloud.com/DjCandikrush/" target="_blank" rel="noopener noreferrer">
          <FaMixcloud size={30} />
        </a>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2>Contact</h2>
        <form onSubmit={sendEmail}>
  <div className="form-group">
    <input type="text" name="title" id="title" required placeholder=" " />
    <label htmlFor="title">Subject</label>
  </div>
  <div className="form-group">
    <input type="text" name="name" id="name" required placeholder=" " />
    <label htmlFor="name">Your Name</label>
  </div>
  <div className="form-group">
    <input type="email" name="email" id="email" required placeholder=" " />
    <label htmlFor="email">Your Email</label>
  </div>
  <div className="form-group">
    <textarea name="message" id="message" required placeholder=" "></textarea>
    <label htmlFor="message">Your Message</label>
  </div>
  <button type="submit">Send</button>
</form>


      </div>

      {/* Footer Text */}
      <p>© {new Date().getFullYear()} OsoTech | All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
