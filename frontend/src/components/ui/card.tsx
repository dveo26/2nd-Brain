import React, { useState, useEffect } from "react";

interface CardProps {
  _id: string;
  title: string;
  link?: string;
  type: "socialPost" | "Notes" | "video" | "document";
  image?: string;
  description?: string;
  tags?: { title: string; _id: string }[];
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

// Function to check if image URL is valid before rendering
const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(image || null);

  // Pre-check if the image is valid when component mounts or image URL changes
  useEffect(() => {
    if (image) {
      setImageLoaded(false);
      preloadImage(image).then((success) => {
        if (!success) {
          console.error("Failed to load image:", image);
          setImageError(true);
          // Try with CORS proxy if direct loading fails
          if (image.startsWith("https://")) {
            // Replace with your CORS proxy if available
            const proxyUrl = `https://cors-anywhere.herokuapp.com/${image}`;
            return preloadImage(proxyUrl).then((proxySuccess) => {
              if (proxySuccess) {
                setImageUrl(proxyUrl);
                setImageError(false);
              }
            });
          }
        } else {
          setImageError(false);
        }
      });
    }
  }, [image]);

  // Function to handle delete
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card click
    if (window.confirm("Are you sure you want to delete this content?")) {
      onDelete(_id);
    }
  };

  // Function to handle card click
  const handleCardClick = () => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  // Function to handle image error
  const handleImageError = () => {
    console.error("Image failed to load:", image);
    setImageError(true);
    setImageLoaded(false);
  };

  // Get domain from URL for placeholder
  const getDomainFromUrl = (url?: string) => {
    if (!url) return "";
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return domain.split(".")[0].charAt(0).toUpperCase();
    } catch (e) {
      return "";
    }
  };

  // Function to render image with fallback
  const renderImage = () => {
    if (!imageUrl || imageError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center p-4">
            <div className="bg-gray-200 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <span className="text-gray-500 text-xl font-semibold">
                {getDomainFromUrl(link) || title.charAt(0)}
              </span>
            </div>
            <p className="text-sm text-gray-500">Image unavailable</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
    );
  };

  // Function to render content based on type
  const renderContent = () => {
    switch (type) {
      case "video":
        if (link) {
          if (youtubeID) {
            return (
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeID}`}
                  title="YouTube Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                  loading="lazy"
                ></iframe>
              </div>
            );
          }
          if (isVideoFile(link)) {
            return (
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <video
                  controls
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => console.error("Video failed to load:", e)}
                >
                  <source src={link} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }
        }
        if (imageUrl) {
          return (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              {renderImage()}
            </div>
          );
        }
        break;

      case "socialPost":
        if (imageUrl) {
          return (
            <div className="w-full aspect-video overflow-hidden rounded-lg bg-gray-50">
              {renderImage()}
            </div>
          );
        } else if (link) {
          return (
            <div className="w-full aspect-video overflow-hidden rounded-lg border bg-gray-50">
              <iframe
                src={link}
                title="Embedded Article"
                className="w-full h-full border-0"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                referrerPolicy="no-referrer"
                onError={(e) => console.error("iFrame failed to load:", e)}
              />
            </div>
          );
        }
        break;

      case "document":
        if (link) {
          return (
            <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
              <iframe
                src={link}
                title="PDF Document"
                className="w-full h-full rounded-lg border"
                loading="lazy"
                onError={(e) => console.error("Document failed to load:", e)}
              ></iframe>
            </div>
          );
        } else if (imageUrl) {
          return (
            <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
              {renderImage()}
            </div>
          );
        }
        break;

      case "Notes":
      default:
        if (imageUrl) {
          return (
            <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-gray-50">
              {renderImage()}
            </div>
          );
        }
    }

    return null;
  };

  // Function to get accent color based on type
  const getTypeColor = () => {
    switch (type) {
      case "video":
        return "blue";
      case "socialPost":
        return "green";
      case "Notes":
        return "amber";
      case "document":
        return "purple";
      default:
        return "gray";
    }
  };

  // Truncate description if it's too long
  const truncatedDescription =
    description && description.length > 150
      ? `${description.substring(0, 150)}...`
      : description;

  return (
    <div
      className={`relative p-5 bg-white rounded-xl border border-gray-200 shadow-sm max-w-80 h-auto transition-all duration-300 transform hover:shadow-lg hover:translate-y-[-2px] overflow-hidden group ${
        link ? "cursor-pointer" : ""
      }`}
      onClick={link ? handleCardClick : undefined}
    >
      {/* Top accent bar based on type */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-${getTypeColor()}-500 rounded-t-xl`}
        aria-hidden="true"
      />

      {/* Delete Icon */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-100"
        aria-label="Delete content"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.75"
          stroke="currentColor"
          className="size-4 text-gray-600 hover:text-red-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>

      {/* Header with Icon & Title */}
      <div className="flex items-center mb-4">
        <div className="flex items-center gap-2.5">
          {type === "video" && (
            <span className="text-blue-600 bg-blue-50 p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
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
            <span className="text-green-600 bg-green-50 p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
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
            <span className="text-amber-600 bg-amber-50 p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
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
            <span className="text-purple-600 bg-purple-50 p-1.5 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
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
      <div className="mb-4">{renderContent()}</div>

      {/* Render Description */}
      {truncatedDescription && (
        <p className="text-sm text-gray-700 mt-3 mb-4 line-clamp-3">
          {truncatedDescription}
        </p>
      )}

      {/* Display Tags with # */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {tags.map((tag) => (
            <span
              key={tag._id}
              className="bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              #{tag.title}
            </span>
          ))}
        </div>
      )}

      {/* Link indicator (if card is clickable) */}
      {link && (
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-violet-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
};
