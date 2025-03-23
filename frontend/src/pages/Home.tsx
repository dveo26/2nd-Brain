import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import AddContentForm from "../components/ui/AddContentForm";
import api from "../api";

// Define the ContentItem type
export interface ContentItem {
  _id: string;
  title: string;
  description?: string;
  type: "video" | "socialPost" | "Notes" | "document";
  link?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Home: React.FC = () => {
  const [showAddContentForm, setShowAddContentForm] = useState(false);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [username, setUsername] = useState(""); // Track username

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUsername(user.username || "User");
    }
  }, []);

  // Fetch content from the backend
  useEffect(() => {
    if (isLoggedIn) {
      fetchContent();
    }
  }, [isLoggedIn]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await api.get<ContentItem[]>("/content");
      console.log("Backend response:", response.data);

      if (Array.isArray(response.data)) {
        setContent(response.data);
      } else {
        setError("Invalid data format received from the server.");
        setContent([]);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to fetch content. Please try again later.");
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle content deletion
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/content/${id}`); // Send DELETE request to the backend
      setContent((prevContent) =>
        prevContent.filter((item) => item._id !== id)
      ); // Update the state
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 h-screen overflow-y-auto">
      {/* Show login/signup message if not logged in */}
      {!isLoggedIn && (
        <div className="flex items-center justify-center h-full">
          <p className="text-2xl font-semibold text-gray-700">
            Please{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              login
            </a>{" "}
            or{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              signup
            </a>{" "}
            first.
          </p>
        </div>
      )}

      {/* Show content if logged in */}
      {isLoggedIn && (
        <>
          {/* Greeting Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Hello, {username}!
            </h1>
          </div>

          {/* Buttons at the top-right */}
          <div className="flex justify-end gap-4 mb-6">
            <Button
              variant="primary"
              size="md"
              text="Add Content"
              startIcon={<span>+</span>}
              onClick={() => setShowAddContentForm(true)}
            />
            <Button
              variant="secondary"
              size="md"
              text="Share Brain"
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-share"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
                </svg>
              }
              onClick={() => console.log("Share Brain Clicked")}
            />
          </div>

          {/* Display loading or error messages */}
          {loading && <p>Loading content...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Render the Card component for each content item */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {content.map((item) => (
              <Card
                key={item._id}
                _id={item._id} // Pass the _id prop
                title={item.title}
                description={item.description}
                link={item.link}
                type={item.type}
                image={item.image}
                onDelete={handleDelete} // Pass the handleDelete function
              />
            ))}
          </div>

          {/* Show the Add Content Form */}
          {showAddContentForm && (
            <AddContentForm
              onClose={() => setShowAddContentForm(false)}
              onContentAdded={fetchContent} // Refresh content after adding
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;
