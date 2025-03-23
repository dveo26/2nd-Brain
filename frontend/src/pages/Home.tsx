import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import ContentContainer from "../components/ui/contentContainer";
import { useNavigate } from "react-router-dom";
import api from "../api";

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

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [contentStats, setContentStats] = useState({
    totalItems: 0,
    videoCount: 0,
    notesCount: 0,
    documentsCount: 0,
    socialPostCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          videoCount: items.filter((item) => item.type === "video").length,
          notesCount: items.filter((item) => item.type === "Notes").length,
          documentsCount: items.filter((item) => item.type === "document")
            .length,
          socialPostCount: items.filter((item) => item.type === "socialPost")
            .length,
        });
      }
    } catch (error) {
      console.error("Error fetching content stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 h-screen overflow-y-auto">
      {/* Show login/signup message if not logged in */}
      {!isLoggedIn && (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-indigo-950 mb-4">
            Second Brain
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your personal knowledge management system
          </p>
          <div className="flex gap-4">
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
          </div>
        </div>
      )}

      {/* Show content if logged in */}
      {isLoggedIn && (
        <>
          {/* Greeting Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {username}!
            </h1>
            <p className="text-gray-600">Here's an overview of your content</p>
          </div>

          {/* Content Statistics */}
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-800"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-indigo-100 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-medium text-indigo-950">
                  Total Content
                </h3>
                <p className="text-3xl font-bold text-indigo-800">
                  {contentStats.totalItems}
                </p>
              </div>
              <div
                className="bg-blue-100 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-blue-200"
                onClick={() => navigate("/video")}
              >
                <h3 className="text-lg font-medium text-blue-950">Videos</h3>
                <p className="text-3xl font-bold text-blue-800">
                  {contentStats.videoCount}
                </p>
              </div>
              <div
                className="bg-amber-100 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-amber-200"
                onClick={() => navigate("/notes")}
              >
                <h3 className="text-lg font-medium text-amber-950">Notes</h3>
                <p className="text-3xl font-bold text-amber-800">
                  {contentStats.notesCount}
                </p>
              </div>
              <div
                className="bg-violet-100 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-violet-200"
                onClick={() => navigate("/content")}
              >
                <h3 className="text-lg font-medium text-violet-950">
                  All Content
                </h3>
                <p className="text-3xl font-bold text-violet-800">View All →</p>
              </div>
            </div>
          )}

          {/* Recent Content */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Recent Content</h2>
            <ContentContainer activeFilter={null} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
