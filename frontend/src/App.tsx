import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Home from "./pages/Home";
import { Sidebar } from "./components/ui/sidebar";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // User is authenticated
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    setIsAuthenticated(false); // Update authentication state
  };

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        onLogout={handleLogout}
      />
    </Router>
  );
};

const AppContent: React.FC<{
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  onLogout: () => void;
}> = ({ isAuthenticated, setIsAuthenticated, onLogout }) => {
  const location = useLocation();

  // Define routes where the Sidebar should NOT appear
  const noSidebarRoutes = ["/login", "/signup"];

  // Check if the current route is in the noSidebarRoutes list
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex bg-white">
      {/* Conditionally render the Sidebar */}
      {showSidebar && (
        <Sidebar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      )}

      {/* Main Content - Scrollable */}
      <div className={`flex-1 ${showSidebar ? "ml-64" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={<Signup setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
