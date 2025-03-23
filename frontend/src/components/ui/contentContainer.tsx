import React, { useEffect, useState } from "react";
import { Card } from "./card"; // Adjust import path as needed
import AddContentForm from "./AddContentForm"; // Adjust import path as needed
import api from "../../api"; // Adjust import path as needed

interface Content {
  _id: string;
  title: string;
  description?: string;
  type: "video" | "socialPost" | "Notes" | "document";
  link?: string;
  image?: string;
  tags: { title: string; _id: string }[];
}

const ContentContainer: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Function to fetch all content
  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/content");
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
  };

  // Fetch content on component mount
  useEffect(() => {
    fetchContent();
  }, []);

  // Handle content deletion
  const handleDelete = (id: string) => {
    setContents((prevContents) =>
      prevContents.filter((content) => content._id !== id)
    );
  };

  // Filter content by type
  const filterByType = async (type: string | null) => {
    setActiveFilter(type);
    setIsLoading(true);

    try {
      let response;
      if (type) {
        response = await api.get(`/content/type/${type}`);
      } else {
        response = await api.get("/content");
      }

      if (response.status === 200) {
        setContents(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Error filtering content:", error);
      setError("Failed to filter content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with Add button and filters */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Content</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add Content
        </button>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => filterByType(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeFilter === null
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => filterByType("video")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeFilter === "video"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Videos
        </button>
        <button
          onClick={() => filterByType("socialPost")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeFilter === "socialPost"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Social Posts
        </button>
        <button
          onClick={() => filterByType("Notes")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeFilter === "Notes"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => filterByType("document")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeFilter === "document"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Documents
        </button>
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
              <p className="text-gray-600 text-lg">No content found</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add Your First Content
              </button>
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
