import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { Card } from "../components/ui/card";
import { motion } from "framer-motion";

interface SharedContentData {
  _id: string;
  title: string;
  description?: string;
  type: "video" | "socialPost" | "Notes" | "document";
  link?: string;
  image?: string;
  tags: { title: string; _id: string }[];
  owner: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const SharedContent: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const [content, setContent] = useState<SharedContentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchSharedContent = async () => {
      if (!hash) return;

      try {
        setIsLoading(true);
        const response = await api.get(`/share/link/${hash}`);
        if (response.status === 200) {
          setContent(response.data); 
          setError(null);
        } else {
          setError("Failed to load content.");
        }
      } catch (err) {
        console.error("Error fetching shared content:", err);
        setError(
          "The content you're looking for couldn't be found or has been removed."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedContent();
  }, [hash]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !content.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-md"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-16 h-16 text-red-500 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Content Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The content you're looking for couldn't be found or has been removed."}
          </p>
          <a
            href="/"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Shared Content</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {content.map((item) => (
          <Card
            key={item._id}
            _id={item._id}
            title={item.title}
            description={item.description}
            type={item.type}
            link={item.link}
            image={item.image}
            tags={item.tags}
            onDelete={() => {}} // Not deletable in shared view
          />
        ))}
      </div>
    </div>
  );
};

export default SharedContent;
