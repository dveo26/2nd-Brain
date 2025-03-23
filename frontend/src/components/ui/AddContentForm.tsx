import React, { useState } from "react";
import { Button } from "./button";
import api from "../../api";

interface AddContentFormProps {
  onClose: () => void;
  onContentAdded: () => void; // Callback to refresh content
}

interface Tag {
  title: string;
}

const AddContentForm: React.FC<AddContentFormProps> = ({
  onClose,
  onContentAdded,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<
    "video" | "socialPost" | "Notes" | "document"
  >("video");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/content", {
        title,
        description,
        type,
        link,
        image,
        tags, // Now including tags
      });

      if (response.status === 201) {
        onClose(); // Close the form
        onContentAdded(); // Refresh the content list
      }
    } catch (error) {
      console.error("Error adding content:", error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, { title: tagInput.trim() }]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center">
      <div className="bg-white shadow-2xl p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Content</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | "video"
                    | "socialPost"
                    | "Notes"
                    | "document"
                )
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="video">Video</option>
              <option value="socialPost">Social Post</option>
              <option value="Notes">Notes</option>
              <option value="document">Document</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Link</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Tags field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full p-2 border rounded-l"
                placeholder="Add a tag"
              />
              <Button
                variant="primary"
                size="md"
                text="Add"
                onClick={handleAddTag}
              />
            </div>

            {/* Display tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
                >
                  <span className="mr-2">{tag.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="md"
              text="Cancel"
              onClick={onClose}
            />
            <Button
              variant="primary"
              size="md"
              text="Add Content"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContentForm;
