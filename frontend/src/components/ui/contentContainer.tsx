import React, { useEffect, useState } from "react";
import { Card } from "./card";
import AddContentForm from "./AddContentForm";
import api from "../../api";
import { Button } from "./button";

interface Content {
  _id: string;
  title: string;
  description?: string;
  type: "video" | "socialPost" | "Notes" | "document";
  link?: string;
  image?: string;
  tags: { title: string; _id: string }[];
}

interface ContentContainerProps {
  activeFilter: string | null;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  activeFilter,
}) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      // If no token, explicitly set logged out state
      setIsLoggedIn(false);
      setContents([]);
      setIsLoading(false);
    }
  }, []);

  const fetchContent = React.useCallback(async () => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    try {
      let response;
      if (activeFilter) {
        response = await api.get(`/content/type/${activeFilter}`);
      } else {
        response = await api.get("/content");
      }

      if (response.status === 200) {
        setContents(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to load your content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, activeFilter]);

  // Fetch content on component mount, when login status or filter changes
  useEffect(() => {
    fetchContent();
  }, [isLoggedIn, fetchContent, activeFilter]);

  // Handle content deletion
  const handleDelete = async (id: string) => {
    try {
      const response = await api.delete(`/content/${id}`);
      if (response.status === 200) {
        // Successfully deleted on the server, now update state
        setContents((prevContents) =>
          prevContents.filter((content) => content._id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      // Show error to user
      setError("Failed to delete content. Please try again.");
    }
  };

  // Function to get the title based on active filter
  const getContentTitle = () => {
    if (!activeFilter) return "";
    switch (activeFilter) {
      case "video":
        return "Videos";
      case "socialPost":
        return "Social Posts";
      case "Notes":
        return "Notes";
      case "document":
        return "Documents";
      default:
        return "Content";
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-2xl font-semibold text-gray-700">
          Please{" "}
          <a href="/login" className="text-indigo-900 hover:underline">
            login
          </a>{" "}
          or{" "}
          <a href="/signup" className="text-indigo-900 hover:underline">
            signup
          </a>{" "}
          first.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gradient-to-b ">
      {/* Header with Add button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{getContentTitle()}</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="primary"
            size="md"
            text="Add Content"
            onClick={() => setShowAddForm(true)}
            startIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* Loading and error states */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
          <button
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Content grid */}
      {!isLoading && !error && (
        <>
          {contents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-12 mx-auto text-gray-400 mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <p className="text-gray-600 text-lg">
                No {activeFilter || "content"} found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {contents.map((content) => (
                <Card
                  key={content._id}
                  _id={content._id}
                  title={content.title}
                  description={content.description}
                  type={content.type}
                  link={content.link}
                  image={content.image}
                  tags={content.tags}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Content Form */}
      {showAddForm && (
        <AddContentForm
          onClose={() => setShowAddForm(false)}
          onContentAdded={() => {
            fetchContent();
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
};

export default ContentContainer;
