import React from "react";
import api from "../../api"; // Import your API instance

interface CardProps {
  _id: string;
  title: string;
  link?: string;
  type: "socialPost" | "Notes" | "video" | "document";
  image?: string;
  description?: string;
  tags?: { title: string; _id: string }[]; // Add tags to props
  onDelete: (id: string) => void;
}

// Function to check if the URL is a direct video file
const isVideoFile = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

// Function to check if the URL is a YouTube link
const extractYouTubeID = (url: string) => {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
};

export const Card: React.FC<CardProps> = ({
  _id,
  title,
  link,
  type,
  image,
  description,
  tags = [], // Default to empty array
  onDelete,
}) => {
  const youtubeID = link ? extractYouTubeID(link) : null;

  // Function to handle delete
  const handleDelete = async () => {
    try {
      await api.delete(`/content/${_id}`); // Send DELETE request
      onDelete(_id); // Notify parent component to update the list
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  // Function to render content based on type
  const renderContent = () => {
    switch (type) {
      case "video":
        if (link) {
          if (youtubeID) {
            return (
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${youtubeID}`}
                title="YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            );
          }
          if (isVideoFile(link)) {
            return (
              <video controls className="w-full rounded-lg">
                <source src={link} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            );
          }
        }
        break;

      case "socialPost":
        if (link) {
          return (
            <div className="mt-2">
              {image ? (
                <img
                  src={image}
                  alt="Social Post"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <iframe
                  src={link}
                  title="Embedded Article"
                  className="w-full h-48 rounded-lg border"
                ></iframe>
              )}
            </div>
          );
        }
        break;

      case "document":
        if (link) {
          return (
            <iframe
              src={link}
              title="PDF Document"
              className="w-full h-60 rounded-lg border"
            ></iframe>
          );
        }
        break;

      case "Notes":
      default:
      // Do nothing, description will be rendered below
    }

    return null;
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 max-w-80 max-h-96 transition-all duration-300 transform hover:shadow-lg hover:scale-105 overflow-y-auto relative">
      {/* Delete Icon */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Delete content"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5 text-gray-500 hover:text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>

      {/* Header with Icon & Title */}
      <div className="flex items-center mb-3">
        <div className="flex items-center gap-2">
          {type === "video" && (
            <span className="text-blue-500">
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
                  d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </span>
          )}
          {type === "socialPost" && (
            <span className="text-green-500">
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
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
            </span>
          )}
          {type === "Notes" && (
            <span className="text-amber-500">
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </span>
          )}
          {type === "document" && (
            <span className="text-purple-500">
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h3>
        </div>
      </div>

      {/* Render Content */}
      {renderContent()}

      {/* Render Description */}
      {description && (
        <p className="text-sm text-gray-700 mt-3 mb-3">{description}</p>
      )}

      {/* Display Tags with # */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {tags.map((tag) => (
            <span
              key={tag._id}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              #{tag.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
