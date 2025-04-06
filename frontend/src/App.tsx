import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Sidebar } from "./components/ui/sidebar";
import ContentContainer from "./components/ui/contentContainer";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/Home";
import { AnimatePresence, motion } from "framer-motion";

// Wrapper component to handle animations
const AnimatedRoutes = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeContentType, setActiveContentType] = useState<string | null>(
    null
  );

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

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
      {/* Sidebar - Only show if authenticated and not on auth pages */}
      {isAuthenticated && !isAuthPage && (
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
          />
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        className={`flex-1 ${
          isAuthenticated && !isAuthPage ? "ml-64" : ""
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
              <Route path="/" element={<Home />} />
              <Route
                path="/content"
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
              <Route path="/shared/:hash" element={<SharedContent />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Placeholder for SharedContent component with animations
const SharedContent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-sm"
    >
      <h1 className="text-2xl font-semibold mb-4">Shared Content</h1>
      <p className="text-gray-600">Loading shared content...</p>
    </motion.div>
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
