import React from "react";
import { Link } from "react-router-dom";

export interface SidebarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isAuthenticated,
  onLogout,
}) => {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-indigo-950 to-violet-900 text-white p-6 shadow-lg">
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

      <h1 className="text-2xl font-bold mb-8 text-violet-200">Second Brain</h1>

      {/* Navigation Links */}
      <nav className="space-y-4">
        {/* Home */}
        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-800 transition-colors"
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

        {/* Video */}
        
        {/* Notes (Appears only if authenticated) */}
        {isAuthenticated && (
          <Link
          to="/video"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-800 transition-colors"
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
          <span>Video</span>
        </Link>
        )}
        {isAuthenticated && (
          <Link
            to="/notes"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-800 transition-colors"
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
            <span>Text</span>
          </Link>
        )}
      </nav>

      {/* Authentication Buttons */}
      <div className="mt-8 border-t border-violet-800 pt-6">
        {!isAuthenticated ? (
          <>
            {/* Signup */}
            <Link
              to="/signup"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-800 transition-colors w-full"
            >
              <span>Signup</span>
            </Link>

            {/* Login */}
            <Link
              to="/login"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-800 transition-colors w-full"
            >
              <span>Login</span>
            </Link>
          </>
        ) : (
          /* Logout */
          <button
            onClick={onLogout}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-800 transition-colors w-full"
          >
            <span>Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};
