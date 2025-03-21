import React from "react";
import { Button } from "../components/ui/button";

const Home: React.FC = () => {
 
  const defaultContent = [
    {
      _id: "1",
      title: "Sample Title 1",
      description: "This is a sample description for the first card.",
      createdAt: "2023-10-01T12:00:00Z",
    },
    {
      _id: "2",
      title: "Sample Title 2",
      description: "This is a sample description for the second card.",
      createdAt: "2023-10-02T12:00:00Z",
    },
    {
      _id: "3",
      title: "Sample Title 3",
      description: "This is a sample description for the third card.",
      createdAt: "2023-10-03T12:00:00Z",
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-6 h-screen overflow-y-auto">
      {/* Buttons at the top-right */}
      <div className="flex justify-end gap-4 mb-6">
        <Button
          variant="primary"
          size="md"
          text="Add Content"
          startIcon={<span>+</span>}
          onClick={() => console.log("Add Content Clicked")}
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

      {/* Render the default content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {defaultContent.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-indigo-950">
              {item.title}
            </h3>
            <p className="text-gray-600 mt-2">{item.description}</p>
            <small className="text-gray-400 block mt-4">
              {new Date(item.createdAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
