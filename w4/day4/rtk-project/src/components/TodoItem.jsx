"use client";
import { useDispatch } from "react-redux";
import { deleteTodo, toggleTodo } from "../features/todoSlice";

export default function TodoItem({ todo }) {
  const dispatch = useDispatch();

  return (
    <div className="flex mx-2 justify-between items-center bg-white p-3 rounded shadow mb-2">
      <div
        className={`flex-1 cursor-pointer ${
          todo.completed ? "line-through text-gray-400" : ""
        }`}
        onClick={() => dispatch(toggleTodo(todo.id))}
      >
        {todo.text}
      </div>
      <button
        onClick={() => dispatch(deleteTodo(todo.id))}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  );
}
