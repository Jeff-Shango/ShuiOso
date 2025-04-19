import React from "react";
import "../styles/PageWrapper.css"; // we’ll create this next

const PageWrapper = ({ children }) => {
  return <div className="fade-in">{children}</div>;
};

export default PageWrapper;
