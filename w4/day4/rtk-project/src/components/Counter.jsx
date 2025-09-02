"use client";
import { decrement, increment, reset } from "@/features/counterSlice";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Counter = () => {
  const dispatch = useDispatch();
  const { value} = useSelector((state) => state.counter);
  // const count = useSelector((state) => state.counter.value);
  return (
    <>
      <Link href="/todo" className="bg-green-500 hover:bg-green-600 p-2 text-white">
        Add Todo
      </Link>
      <div className="bg-gray rounded-2xl mx-auto mt-20 shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Run Counter
        </h2>

        <div className="flex items-center justify-between mb-8">
          {/* <!-- Decrement Button --> */}
          <button
            onClick={() => dispatch(decrement("-"))}
            className="bg-red-500 hover:bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <span className="text-3xl font-bold">-</span>
          </button>

          {/* <!-- Counter Display --> */}
          <div className="text-5xl font-bold text-gray-800 mx-6 w-20 text-center">
            {value}
          </div>

          {/* <!-- Increment Button --> */}
          <button
            onClick={() => dispatch(increment("+"))}
            className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <span className="text-3xl font-bold">+</span>
          </button>
        </div>

        {/* <!-- Reset Button --> */}
        <div onClick={() => dispatch(reset("r"))} className="text-center">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors duration-200">
            Reset Counter
          </button>
        </div>
        <p className="text-center text-gray-600 mt-4">Last Action: {value}</p>
      </div>
    </>
  );
};

export default Counter;
