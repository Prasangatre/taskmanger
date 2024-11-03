"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Comment, Task } from "../utils/mock-data";
import { TaskStatus } from "../utils/type";
interface DetailModalProps {
  setSelectedTask: Dispatch<SetStateAction<Task | null>>;
  selectedTask: Task;
  comments: Comment[];
  setComments: Dispatch<SetStateAction<Comment[]>>;
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
}
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  task,
  newStatus,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  task: Task;
  newStatus: TaskStatus;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
        <p>
          Are you sure you want to change the status of task "{task.name}" from{" "}
          {task.status} to {newStatus}?
        </p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export function DetailModal({
  setSelectedTask,
  selectedTask,
  comments,
  setComments,
  onStatusChange,
}: DetailModalProps) {
  const [newComment, setNewComment] = useState("");
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newComment.trim()) return;

    const newCommentObj: Comment = {
      id: comments.length + 1,
      content: newComment,
      name_of_sender: "Current User",
      created_at: new Date().toISOString(),
      task_id: selectedTask.id,
    };

    setComments((prev: Comment[]) => [newCommentObj, ...prev]);
    setNewComment("");
  };
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    newStatus: TaskStatus | null;
  }>({ isOpen: false, newStatus: null });
  const handleStatusChangeConfirm = () => {
    if (confirmModal.newStatus) {
      onStatusChange(selectedTask.id, confirmModal.newStatus);
    }
    setConfirmModal({ isOpen: false, newStatus: null });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTask) return;
      console.log(e.key);
      switch (e.key) {
        case "1":
          e.preventDefault();
          setConfirmModal({ isOpen: true, newStatus: "OPEN" });
          break;
        case "2":
          e.preventDefault();
          setConfirmModal({ isOpen: true, newStatus: "IN_PROGRESS" });
          break;
        case "3":
          e.preventDefault();
          setConfirmModal({ isOpen: true, newStatus: "CLOSED" });
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTask]);

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Task Details</h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto ">
            <h3 className="font-medium">Task Information</h3>

            <div className=" grid grid-cols-2 gap-4 mb-4">
              <p>Name: {selectedTask.name}</p>
              <p>Priority: {selectedTask.priority}</p>
              <p>Status: {selectedTask.status}</p>

              <p>
                Created: {new Date(selectedTask.created_at).toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span>Status:</span>
                <select
                  value={selectedTask.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as TaskStatus;
                    setConfirmModal({ isOpen: true, newStatus });
                  }}
                  className="p-1 border rounded"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <span className="text-sm text-gray-500">
                  (Shortcut: 1-Open, 2-In Progress, 3-Closed)
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-4">Comments</h3>
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </form>
              <div className="space-y-4">
                {comments
                  ?.filter((comment) => comment.task_id === selectedTask.id)
                  .map((comment) => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">
                          {comment.name_of_sender}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="p-4 border-t">
            <button
              onClick={() => setSelectedTask(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {confirmModal.isOpen && (
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, newStatus: null })}
          onConfirm={handleStatusChangeConfirm}
          task={selectedTask}
          newStatus={confirmModal.newStatus as TaskStatus}
        />
      )}
    </div>
  );
}
