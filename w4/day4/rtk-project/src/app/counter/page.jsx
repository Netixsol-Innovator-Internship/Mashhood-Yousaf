'use client';
import Counter from "@/components/Counter";
import { counterStore } from "@/store/counterStore";
import React from "react";
import { Provider } from "react-redux";

const CounterPage = () => {
  return (
    <Provider store={counterStore}>
      <Counter />
    </Provider>
  );
};

export default CounterPage;
