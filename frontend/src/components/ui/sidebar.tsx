import React from "react";
import { Link, useNavigate } from "react-router-dom";

export interface SidebarProps {
  isAuthenticated: boolean;
  
  activeContentType: string | null;
  onFilterChange: (type: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isAuthenticated,

  activeContentType,
  onFilterChange,
}) => {
  const navigate = useNavigate();

  const handleContentTypeClick = (type: string | null) => {
    onFilterChange(type);
    navigate("/"); // Navigate to home page to show filtered content
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-indigo-950 to-slate-950 text-white p-6 shadow-lg">
      <div className="flex items-center jutify-center px-4 ">
        <svg
          className="w-[43px] h-[43px] text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 18.5A2.493 2.493 0 0 1 7.51 20H7.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .92-3.182 2.477 2.477 0 0 1 1.876-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 12 5.5m0 13v-13m0 13a2.493 2.493 0 0 0 4.49 1.5h.01a2.468 2.468 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.477 2.477 0 0 0-1.875-3.344A2.5 2.5 0 0 0 14.5 3 2.5 2.5 0 0 0 12 5.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M20 10.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-8 flex items-center text-white">
        Second Brain
      </h1>
      {/* Navigation Links */}
      <nav className="space-y-4">
        {/* Home */}
        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-950 transition-colors"
          onClick={() => handleContentTypeClick(null)}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
            />
          </svg>
          <span>Home</span>
        </Link>

        {/* Content Type Filters (Only if authenticated) */}
        {isAuthenticated && (
          <>
            <div className="mt-4 mb-2 text-sm text-white font-medium">
              Content Types
            </div>

           

            {/* Videos */}
            <button
              onClick={() => handleContentTypeClick("video")}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left ${
                activeContentType === "video"
                  ? "bg-slate-900 opacity-80"
                  : "hover:bg-indigo-950"
              }`}
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
                />
              </svg>
              <span>Videos</span>
            </button>

            {/* Social Posts */}
            <button
              onClick={() => handleContentTypeClick("socialPost")}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left ${
                activeContentType === "socialPost"
                  ? "bg-slate-900 opacity-80"
                  : "hover:bg-indigo-950"
              }`}
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9.5V8a2 2 0 0 0-2-2h-4V4.5a1.5 1.5 0 0 0-3 0V6H5a2 2 0 0 0-2 2v1.5m15 0v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5m15 0H3"
                />
              </svg>
              <span>Social Posts</span>
            </button>

            {/* Notes */}
            <button
              onClick={() => handleContentTypeClick("Notes")}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left ${
                activeContentType === "Notes"
                  ? "bg-slate-900 opacity-80"
                  : "hover:bg-indigo-950"
              }`}
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                />
              </svg>
              <span>Notes</span>
            </button>

            {/* Documents */}
            <button
              onClick={() => handleContentTypeClick("document")}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left ${
                activeContentType === "document"
                  ? "bg-slate-900 opacity-80"
                  : "hover:bg-indigo-950"
              }`}
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <span>Documents</span>
            </button>
          </>
        )}
      </nav>
      {/* Authentication Buttons */}
      <div className="mt-8 border-t border-slate-950 pt-6">
        {!isAuthenticated ? (
          <>
            {/* Signup */}
            <Link
              to="/signup"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-950 transition-colors w-full"
            >
              <span>Signup</span>
            </Link>

            {/* Login */}
            <Link
              to="/login"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-950 transition-colors w-full"
            >
              <span>Login</span>
            </Link>
          </>
        ) : (
          <>
            
          </>
        )}
      </div>
    </div>
  );
};
