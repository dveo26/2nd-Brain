import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Sidebar } from "./components/ui/sidebar";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/Home";
// Import the actual SharedContent component
import { AnimatePresence, motion } from "framer-motion";
import SharedContent from "./pages/sharedContent";

// Wrapper component to handle animations
const AnimatedRoutes = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeContentType, setActiveContentType] = useState<string | null>(
    null
  );

  // Check for authentication token on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    // This will help when token changes
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isSharedContentPage = location.pathname.includes("/shared/");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setActiveContentType(null);
  };

  const handleFilterChange = (type: string | null) => {
    setActiveContentType(type);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Only show if authenticated and not on auth pages or shared content page */}
      {isAuthenticated && !isAuthPage && !isSharedContentPage && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="z-10"
        >
          <Sidebar
            isAuthenticated={isAuthenticated}
            activeContentType={activeContentType}
            onFilterChange={handleFilterChange}
            onLogout={handleLogout}
          />
        </motion.div>
      )}
      {/* Main Content */}
      <motion.div
        className={`flex-1 ${
          isAuthenticated && !isAuthPage && !isSharedContentPage ? "ml-64" : ""
        } p-6 overflow-y-auto`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Routes location={location}>
              <Route
                path="/"
                element={
                  <Home
                    activeContentType={activeContentType}
                    setActiveContentType={setActiveContentType}
                  />
                }
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
              <Route path="/shared/:hash" element={<SharedContent />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;
