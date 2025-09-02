"use client";
import { Provider } from "react-redux";
import AddTodo from "../../components/AddTodo";
import TodoList from "../../components/TodoList";
import PostList from "../../components/PostLists";
import { store } from "../../store/store";
import Link from "next/link";

export default function TodoPage() {
  return (
    <Provider store={store}>
      <Link
        href="/counter"
        className="bg-blue-600 hover:bg-green-600  p-2 text-white"
      >
        {" "}
        Counter{" "}
      </Link>
      <div className="max-w-xl mx-auto mt-10">
        {/* <Counter/> */}

        <h1 className="text-3xl font-bold text-center mb-6">My Notes</h1>
        <AddTodo />
        <TodoList />
        <PostList />
      </div>
    </Provider>
  );
}
