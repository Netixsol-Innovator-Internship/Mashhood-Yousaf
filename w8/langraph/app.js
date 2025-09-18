import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import readline from "readline";

// 1. Initialize Gemini model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.0-flash", // free tier
});

// 2. Define a node function
const callModel = async (state) => {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
};

// 3. Create graph
const graph = new StateGraph(MessagesAnnotation)
  .addNode("chatbot", callModel)
  .addEdge("__start__", "chatbot");

const app = graph.compile();

// 4. Setup CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Gemini LangGraph Chatbot started! Type 'exit' to quit.");

async function ask(state = { messages: [] }) {
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === "exit" || input.trim().length < 2) {
      rl.close();
      return;
    }
    const newState = await app.invoke({
      messages: [...state.messages, { role: "user", content: input }],
    });

    const lastMessage = newState.messages[newState.messages.length - 1];
    console.log("AI:", lastMessage.content);

    ask(newState);
  });
}

ask();
