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

const Home: React.FC<HomeProps> = ({ activeContentType }) => {
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

    window.location.href = "/";
  };

  const handleShareBrain = async () => {
    try {
      setShareLoading(true);
      setShareError(null);
      setShareSuccess(false);

      const response = await api.post("/share/link");

      if (response.status === 201 && response.data.hash) {
        const shareableUrl = `${window.location.origin}/shared/${response.data.hash}`;

        await navigator.clipboard.writeText(shareableUrl);
        setShareSuccess(true);

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <motion.div
          className="min-h-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Show login/signup message if not logged in */}
          {!isLoggedIn && (
            <motion.div
              className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-br from-indigo-200 via-white to-indigo-400 relative overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 },
                },
              }}
            >
              {/* Decorative SVG background */}
              <svg
                className="absolute top-0 left-0 w-full h-64 opacity-20"
                viewBox="0 0 1440 320"
              >
                <path
                  fill="#6366f1"
                  fillOpacity="1"
                  d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
                ></path>
              </svg>
              {/* Hero Section */}
              <motion.div
                className="flex flex-col items-center text-center mb-16 z-10"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.15 },
                  },
                }}
              >
                <motion.h1
                  className="text-6xl md:text-7xl font-extrabold text-indigo-900 mb-4 drop-shadow-lg"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7 },
                    },
                  }}
                >
                  Second Brain
                </motion.h1>
                <motion.p
                  className="text-2xl md:text-3xl text-indigo-700 mb-10 max-w-2xl mx-auto"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7, delay: 0.1 },
                    },
                  }}
                >
                  Your personal knowledge management system. Organize, share,
                  and access your ideas from anywhere.
                </motion.p>
                <motion.div
                  className="flex gap-8 justify-center mb-8"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, delay: 0.2 },
                    },
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      text="Get Started"
                      onClick={() => navigate("/signup")}
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      variant="secondary"
                      size="lg"
                      text="Login"
                      onClick={() => navigate("/login")}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Features Section (keep existing) */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-8 z-10"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.18 },
                  },
                }}
              >
                {/* Feature 1 */}
                <motion.div
                  className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7 },
                    },
                  }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 8px 32px rgba(99,102,241,0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <svg
                      className="w-10 h-10 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6l4 2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-900">
                    Organize Effortlessly
                  </h3>
                  <p className="text-gray-600">
                    Categorize your notes, links, and ideas with tags and
                    filters for easy access.
                  </p>
                </motion.div>
                {/* Feature 2 */}
                <motion.div
                  className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7 },
                    },
                  }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 8px 32px rgba(99,102,241,0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <svg
                      className="w-10 h-10 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12h.01M12 12h.01M9 12h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-900">
                    Share Instantly
                  </h3>
                  <p className="text-gray-600">
                    Create shareable links to your knowledge base and
                    collaborate with others.
                  </p>
                </motion.div>
                {/* Feature 3 */}
                <motion.div
                  className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7 },
                    },
                  }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 8px 32px rgba(99,102,241,0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <svg
                      className="w-10 h-10 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-900">
                    Access Anywhere
                  </h3>
                  <p className="text-gray-600">
                    Your second brain is always with you, on any device, anytime
                    you need it.
                  </p>
                </motion.div>
              </motion.div>

              {/* How It Works Section */}
              <section className="w-full max-w-5xl mt-20 z-10">
                <h2 className="text-3xl font-bold text-indigo-900 text-center mb-10">
                  How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                      <svg
                        className="w-8 h-8 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-indigo-900">
                      1. Sign Up
                    </h3>
                    <p className="text-gray-600 text-center">
                      Create your free account in seconds and start building
                      your second brain.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                      <svg
                        className="w-8 h-8 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-indigo-900">
                      2. Organize
                    </h3>
                    <p className="text-gray-600 text-center">
                      Add notes, links, and documents. Tag and filter your
                      content for easy access.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                      <svg
                        className="w-8 h-8 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-indigo-900">
                      3. Access Anywhere
                    </h3>
                    <p className="text-gray-600 text-center">
                      Your knowledge is always available, on any device,
                      whenever you need it.
                    </p>
                  </div>
                </div>
              </section>

              {/* Testimonials Section */}
              <section className="w-full max-w-5xl mt-20 z-10">
                <h2 className="text-3xl font-bold text-indigo-900 text-center mb-10">
                  What Our Users Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                    <p className="text-gray-700 italic mb-4">
                      "Second Brain has completely changed the way I organize my
                      thoughts. Highly recommended!"
                    </p>
                    <span className="font-semibold text-indigo-700">
                      — Alex P.
                    </span>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                    <p className="text-gray-700 italic mb-4">
                      "Sharing my notes with my team is now effortless. The best
                      productivity tool I've used."
                    </p>
                    <span className="font-semibold text-indigo-700">
                      — Jamie L.
                    </span>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                    <p className="text-gray-700 italic mb-4">
                      "I love how I can access my knowledge base from anywhere.
                      The UI is beautiful and easy to use."
                    </p>
                    <span className="font-semibold text-indigo-700">
                      — Morgan S.
                    </span>
                  </div>
                </div>
              </section>
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/80 backdrop-blur-md shadow-inner mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <span>Second Brain &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
