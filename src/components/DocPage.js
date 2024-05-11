// LandingPage.js
import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="container mt-5">
      <h1>Welcome to Document Management System</h1>
      <div className="mt-4">
        <Link to="/AddDocument" className="btn btn-primary me-2">Add Document</Link>
        <Link to="/DocumentList" className="btn btn-success me-2">Document List</Link>
      </div>
    </div>
  );
};

export default LandingPage;
