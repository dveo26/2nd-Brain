import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import App from "./App";

const Root: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={(value: boolean) => { console.log("Authentication status:", value); }} />} />
        <Route path="/login" element={<Login setIsAuthenticated={(value: boolean) => { console.log("Authentication status:", value); }} />} />
      </Routes>
    </Router>
  );
};

export default Root;
