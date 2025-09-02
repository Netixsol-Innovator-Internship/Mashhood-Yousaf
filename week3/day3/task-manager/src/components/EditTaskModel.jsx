import { useState, useEffect } from "react";

const EditTaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
console.log("updatedTitle", updatedTitle);
console.log("updatedDescription", updatedDescription);
  useEffect(() => {
    if (task) {
      setUpdatedTitle(task.task || "");
      setUpdatedDescription(task.description || "");
    }
  }, [task]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

        <input
          type="text"
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Task title"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
        />

        <textarea
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Task description"
          rows="3"
          value={updatedDescription}
          onChange={(e) => setUpdatedDescription(e.target.value)}
        ></textarea>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() =>
              onSave(task._id, {
                updatedTitle,
                updatedDescription,
              })
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
