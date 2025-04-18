import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import EventShowcase from "./pages/EventShowcase";
import MusicPlayer from "./pages/MusicPlayer";
import Header from "./pages/Header"; 
import Footer from "./Footer";
import "./styles/App.css";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Bio from "./pages/Bio";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
            {/* 🧱 Site Structure */}
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<EventShowcase />} />
        <Route path="/music" element={<MusicPlayer />} />
        <Route path="*" element={<NotFound />} /> 
        <Route path="/admin" element={<Admin />} /> 
        <Route path="/bio" element={<Bio />} /> 
        <Route path="/contact" element={<Contact />} /> 
      </Routes>
      <Footer />
    </Router>
  );
}


export default App;
