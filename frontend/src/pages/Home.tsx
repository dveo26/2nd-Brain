import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import ContentContainer from "../components/ui/contentContainer";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";

// Define the ContentItem type
export interface ContentItem {
  _id: string;
  title: string;
  description?: string;
  type: "video" | "socialPost" | "Notes" | "document";
  link?: string;
  image?: string;
  tags?: { title: string; _id: string }[];
  createdAt?: string;
  updatedAt?: string;
}

interface HomeProps {
  activeContentType?: string | null;
  setActiveContentType?: React.Dispatch<React.SetStateAction<string | null>>;
}

const Home: React.FC<HomeProps> = ({
  activeContentType,
  setActiveContentType,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [contentStats, setContentStats] = useState({
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUsername(user.username || "User");

      // Fetch stats
      fetchContentStats();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch content statistics
  const fetchContentStats = async () => {
    try {
      setLoading(true);
      const response = await api.get<ContentItem[]>("/content");

      if (Array.isArray(response.data)) {
        const items = response.data;
        setContentStats({
          totalItems: items.length,
        });
      }
    } catch (error) {
      console.error("Error fetching content stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    setContentStats({
      totalItems: 0,
    });

    // Force a navigation and page refresh
    window.location.href = "/";
    // Don't use navigate() here as it won't refresh the page state
  };

  // Handle content type filter - updated to use the prop from App.tsx
  const handleFilterChange = (type: string | null) => {
    if (setActiveContentType) {
      setActiveContentType(type);
    }
  };

  // Handle share brain functionality
  const handleShareBrain = async () => {
    try {
      setShareLoading(true);
      setShareError(null);
      setShareSuccess(false);

      const response = await api.post("/share/link");

      if (response.status === 201 && response.data.hash) {
        // Create a shareable URL
        const shareableUrl = `${window.location.origin}/shared/${response.data.hash}`;

        // Copy to clipboard
        await navigator.clipboard.writeText(shareableUrl);
        setShareSuccess(true);

        // Auto-hide success message after 3 seconds
        setTimeout(() => setShareSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error creating share link:", error);
      setShareError("Failed to create share link");

      // Auto-hide error message after 3 seconds
      setTimeout(() => setShareError(null), 3000);
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Show login/signup message if not logged in */}
      {!isLoggedIn && (
        <motion.div
          className="flex flex-col items-center justify-center h-full py-12"
          variants={containerVariants}
        >
          <motion.h1
            className="text-5xl font-bold text-indigo-950 mb-4"
            variants={itemVariants}
          >
            Second Brain
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 mb-12"
            variants={itemVariants}
          >
            Your personal knowledge management system
          </motion.p>
          <motion.div className="flex gap-6" variants={itemVariants}>
            <Button
              variant="primary"
              size="lg"
              text="Login"
              onClick={() => navigate("/login")}
            />
            <Button
              variant="secondary"
              size="lg"
              text="Sign Up"
              onClick={() => navigate("/signup")}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Show content if logged in */}
      {isLoggedIn && (
        <>
          {/* Header with greeting, logout, and share button */}
          <motion.div
            className="flex justify-between items-center mb-8"
            variants={itemVariants}
          >
            <Button
              variant="secondary"
              size="sm"
              text="Logout"
              onClick={handleLogout}
            />
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Welcome, {username}
              </h1>
              <p className="text-gray-500 mt-1">
                Your second brain is ready for new ideas
              </p>
            </div>

            {/* Share Brain Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                size="md"
                text={shareLoading ? "Sharing..." : "Share Brain"}
                onClick={handleShareBrain}
                startIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                    />
                  </svg>
                }
              />
            </motion.div>
          </motion.div>

          {/* Status messages */}
          <div className="h-10">
            {shareSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 rounded mb-4"
              >
                Link copied to clipboard! ✓
              </motion.div>
            )}

            {shareError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded mb-4"
              >
                {shareError}
              </motion.div>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <motion.div
              className="flex justify-center my-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-800"></div>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} className="mb-6">
              <motion.div
                className="mb-2 pl-2 border-l-4 border-indigo-500 flex justify-between items-center"
                variants={itemVariants}
              >
                <h2 className="text-xl font-semibold">
                  {activeContentType
                    ? activeContentType.charAt(0).toUpperCase() +
                      activeContentType.slice(1)
                    : "All Content"}
                </h2>
                <span className="text-gray-500 text-sm">
                  {contentStats.totalItems} items total
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* Content Container */}
          <motion.div variants={itemVariants}>
            <ContentContainer activeFilter={activeContentType ?? null} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Home;
