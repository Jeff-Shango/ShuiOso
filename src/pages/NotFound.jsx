import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";
// import PageWrapper from "./PageWrapper";

const NotFound = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
    <div className="not-found-container">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="home-link">Go Home</Link>
    </div>
    </>
  );
};

export default NotFound;
