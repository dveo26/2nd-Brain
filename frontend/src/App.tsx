import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Sidebar } from "./components/ui/sidebar";
import ContentContainer from "./components/ui/contentContainer";
import Login from "./pages/login";
import Signup from "./pages/signup";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeContentType, setActiveContentType] = useState<string | null>(
    null
  );

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);

      // Verify token validity with backend (optional)
      // api.get("/auth/verify").catch(() => {
      //   localStorage.removeItem("token");
      //   localStorage.removeItem("user");
      //   setIsAuthenticated(false);
      // });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    // Reset content type when logging out
    setActiveContentType(null);
  };

  const handleFilterChange = (type: string | null) => {
    setActiveContentType(type);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          activeContentType={activeContentType}
          onFilterChange={handleFilterChange}
        />

        {/* Main Content */}
        <div className="flex-1 ml-64 p-6 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={<ContentContainer activeFilter={activeContentType} />}
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Signup setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            {/* Redirect any unknown paths to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
